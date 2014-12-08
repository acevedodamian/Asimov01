define([
    'underscore',
    'backbone',
    'APP',
    'utils',
    'app/collections/sincronizacion-collection',
    'app/models/sincronizacion',
    'app/collections/version-collection',
    'app/collections/entrega-collection',
    'app/collections/validacion-collection',

], function(_, Backbone, APP, utils,
             SincronizacionCollection,
             Sincronizacion,
             VersionCollection,
             EntregaCollection,
             ValidacionCollection){

var commons = {

    //ENCARGADO DE CARGAR LAS ENTREGAS
    cargarEntregas: function (callback) {

        var self = this;

        APP.notifier.notify({
            message: "Consultando Datos...",
            position: 'center',
            fadeInMs: 0,
            fadeOutMs: 0,
            ms: null,
            modal: true,
            loader: true,
            destroy: false,
            width: APP.config.POPUP_WIDTH
        });

        //SE ENVIA EL ID DEL DESTACAMENTO DEL USUARIO LOGUEADO
        APP.entregas = new EntregaCollection(null, {
                idDestacamento: APP.usuarioActual.get('destacamento').id
            }
        );

        APP.entregas.fetch({
            success: function (model, response, options) {

                //guarda el fech del usuario
                var modelEntrega = self.textModel(model);

                //TODO OK PASA A LA DE SINCRONIZACION
                console.log("success entregas fetch. ");
                var validacion = new ValidacionCollection();
                validacion.fetch();
                self.cargarSincronizacion(modelEntrega, callback);

            },
            error: function (model, response, options) {
                utils.notifyError("No hay datos disponibles, conéctese a una red!");
                console.error("Error en entregas fetch: " + JSON.stringify(response));
                self.crearSincronizacion(JSON.stringify(response), null);
                self.salvarSincronizacion(null);
            }
        });

    },

    //ENCARGADA DE CARGAR LA SINCRONIZACION
    cargarSincronizacion: function (modelEntrega, callback) {

        var dispositivo;

        // SI ES DISPOSITIVO
        if (window.device) {
            dispositivo = window.device.uuid;
        } else {
            dispositivo = 'Browser';
        }

        APP.currentUserSincronizacion = new SincronizacionCollection(null, {
            id: APP.usuarioActual.get('id'),
            uuId: dispositivo,
        });

        var self = this;
        APP.currentUserSincronizacion.fetch({
            success: function (model, response, options) {
                // EN GUARDA EN LA BASE LA ACTUALIZACION DE LA SINCRONIZACION DEL USUARIO
                self.crearSincronizacion(modelEntrega, null);
                self.salvarSincronizacion(callback);
            },

            error: function (model, response, options) {
                //SINO EXISTE SE CREA LA ACTUALIZACION DEL USUARIO.
                self.crearSincronizacion(modelEntrega, null);
                self.salvarSincronizacion(callback);
            }
        });

    },

    //SALVAR SINCRO DEL LA SINCRO ENTREGA
    crearSincronizacion: function (textModelEntrega , entrega) {

        var fechaDeHoy = new Date().toISOString();
        var sincronizacion = new Sincronizacion();
        sincronizacion.set('updated_at', fechaDeHoy);
        sincronizacion.set('idUsuario', APP.usuarioActual.get('id'));
        sincronizacion.set('fecha', fechaDeHoy);

        if (window.device) {
            sincronizacion.set('uuid', window.device.uuid);
        } else {
            sincronizacion.set('uuid', 'Browser');
        }

        sincronizacion.set('detalle', textModelEntrega);

        if(entrega !== null){
            sincronizacion.set('idEntrega', entrega);
        }

        APP.currentUserSincronizacion.push(sincronizacion);
    },



    // Guarda la sincronizacion
    salvarSincronizacion: function (callback) {
        var indexUltima = APP.currentUserSincronizacion.models.length;
        var sincroUltima = APP.currentUserSincronizacion.models[indexUltima - 1];

        sincroUltima.save({}, {

           success: function (model, response, options) {
               console.log('sincro guardada ' + JSON.stringify(response));

               if (callback !== null) {
                   APP.notifier.destroyAll();
                   callback();
               }
           },
           error: function (model, response, options) {
               console.error('Error al guardar sincro: ' + JSON.stringify(response));

               utils.notifyError("Ocurri&oacute; un error, cont&aacute;ctese con soporte");
               if (callback !== null) {
                   callback();
               }
           }

       });

    },


    // Retorna true si hay una actualizacion mandatoria para descargar.
    checkNewVersion: function () {

        APP.notifier.notify({
            message: "Buscando actualización...",
            position: 'center',
            fadeInMs: 0,
            fadeOutMs: 0,
            ms: null,
            modal: true,
            loader: true,
            destroy: false,
            width: APP.config.POPUP_WIDTH
        });

        //BUSCA EN EL SERVER
        var version = new VersionCollection();
        var self = this;
        version.fetch({
            success: function () {
                //SI EXISTE
                APP.version = version;
                if (APP.version !== null) {
                    //versionDescarga
                    APP.notifier.destroyAll();
                    self.checkIfNewVersion();
                } else {
                    console.log("No hay version de descarga");
                }
            },
        });
    },

    // Chequea si hay una nueva version para descargar y en caso de que
    // sea mandatoria retorna true.
    checkIfNewVersion: function () {

        var self = this;
        //toma la version del apk en ejecucion
        var version_apk = utils.replaceAll(APP.config.VERSION_APK, ".", "");
        //toma la version de la apk que esta en el servidor
        var model_version_apk = utils.replaceAll(APP.version.models[0].get('version'), ".", "");

        // las paso a numero
        var nVersion_apk = Number(version_apk);
        var nModel_version_apk = Number(model_version_apk);

        //si la version es vieja
        if (nVersion_apk < nModel_version_apk) {

            APP.logeadoRecien = 0;
            APP.notifier.destroyAll();

            //si es obligatoria la descarga
            if (APP.version.models[0].get('mandatory') == "true") {

                //se navega a una pagina para que no pueda utilizarla la aplicacion
                APP.router.navigate("versionDescarga", {
                    trigger: true
                });

                return true;
            } else {

                APP.notifier.notify({
                    message: "Nueva versión disponible para descargar",
                    'type': "info",
                    theme: 'dialog',
                    buttons: [{
                        'data-role': 'ok',
                        text: 'Descargar',
                        'class': 'default'
                                }, {
                        'data-role': 'cancel',
                        text: 'Cancelar',
                        'class': 'default'
                            }],
                    modal: true,
                    position: 'center',
                    ms: null,
                    destroy: false
                })
                    .on('click:ok', function () {

                        this.destroy();
                        self.descarga();

                    })
                    .on('click:cancel', function () {
                        this.destroy();
                    });

                return false;
            }
        } else {

            if (APP.logeadoRecien != 1) {

                APP.notifier.notify({
                    message: "Esta es la ultima versión disponible",
                    'type': "info",
                    theme: 'dialog',
                    buttons: [{
                        'data-role': 'ok',
                        text: 'Ok',
                        'class': 'default'
                                }],
                    modal: true,
                    position: 'center',
                    ms: null,
                    destroy: false
                })
                    .on('click:ok', function () {
                        this.destroy();
                    });
            } else {

                APP.logeadoRecien = 0;
            }

            console.log('ultima versión disponible');
            return false;
        }

    },

    //ENCARGADA DE DESCARGA LA APK
    descarga: function () {

        //Pregunta si es un dispositivo Mobile
        if (window.device) {

            //Funcion que genera una carpeta en la raiz del dispositivo
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function onFileSystemSuccess(fileSystem) {

                    /*Encargado de general la carpeta GDelivery*/
                    var directoryEntry = fileSystem.root;
                    APP.fullPath = directoryEntry.toInternalURL();
                    directoryEntry.getDirectory(APP.config.DOWNLOAD_STORAGE_FOLDER, {
                        create: true,
                        exclusive: false
                    });

                    //Encargado de Descargar la APK.
                    var fileTransfer = new FileTransfer();
                    //url
                    var uri = encodeURI(APP.version.models[0].get("download"));
                    //url
                    var url = APP.version.models[0].get("download");
                    //nombre del apk
                    var archivo = url.substring(url.lastIndexOf("/") + 1, url.length);
                        //path completo donde fue descargada la apk en el dispositivo
                    var fileURL = APP.fullPath + APP.config.DOWNLOAD_STORAGE_FOLDER + '/' + archivo;

                    APP.notifier.destroyAll();

                    APP.notifier.notify({
                        message: "Descargado aplicación...",
                        position: 'center',
                        fadeInMs: 0,
                        fadeOutMs: 0,
                        ms: null,
                        modal: true,
                        loader: true,
                        destroy: true,
                        width: APP.config.POPUP_WIDTH
                    });

                    //ENCARGADO DE LA DESCARGA
                    fileTransfer.download(
                        uri,
                        fileURL,
                        function (entry) {

                            console.log("download complete: " + entry.toURL());

                            /*Encargado de Abrir la apk descargada*/
                            window.plugins.webintent.startActivity({
                                    action: window.plugins.webintent.ACTION_VIEW,
                                    url: APP.fullPath + APP.config.DOWNLOAD_STORAGE_FOLDER + '/' + archivo,
                                    type: 'application/vnd.android.package-archive'
                                },
                                function () {
                                    /*TERMINADO DE ABRIR APK*/
                                    setTimeout(APP.notifier.destroyAll, 4500);
                                },
                                function () {

                                    APP.notifier.destroyAll();
                                    APP.notifier.notify({
                                        message: "Fallo al abrir la aplicación",
                                        'type': "info",
                                        theme: 'dialog',
                                        buttons: [{
                                            'data-role': 'ok',
                                            text: 'Ok',
                                            'class': 'default'
                                        }],
                                        modal: true,
                                        position: 'center',
                                        ms: null,
                                        destroy: false
                                    })
                                        .on('click:ok', function () {

                                            this.destroy();
                                        });
                                    console.log("fallo al abrir la aplicacion");
                                }
                            );
                        },
                        function (error) {

                            APP.notifier.destroyAll();

                            var mensage = "";
                            if (navigator.connection.type == Connection.NONE) {

                                mensage = "Fallo la descarga (conéctese a una red wifi)";
                            } else {
                                mensage = "Fallo la descarga";
                            }

                            APP.notifier.notify({
                                message: mensage,
                                'type': "info",
                                theme: 'dialog',
                                buttons: [{
                                    'data-role': 'ok',
                                    text: 'Ok',
                                    'class': 'default'
                                }],
                                modal: true,
                                position: 'center',
                                ms: null,
                                destroy: false
                            })
                                .on('click:ok', function () {

                                    this.destroy();

                                });

                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("upload error code" + error.code);
                        }
                        /*,
                        false, {
                            headers: {
                                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                            }
                        }*/
                    );
                }
            );

        } else {
            //SI ESTA EN UN BROWSER
            window.location.href = APP.version.models[0].get("download");
        }
    },

    textModel: function (model) {
        var cadena = "";

        if (this.isCollectionOrModel(model)) {
            //si existe
            if (model.collection.localStorage.pendingMsgs) {
                //completa un en string solo todos los valores del model
                cadena = this.cadenaCompleta(model);

                return cadena;
            }
        } else {
            if (model.localStorage.pendingMsgs) {
                cadena = this.cadenaCompleta(model);

                return cadena;
            }
        }
    },

    // Completa una cadena entera con todos los valores del modelo
    cadenaCompleta: function (model) {
        var cadena = "";

        if (this.isCollectionOrModel(model)) {
            _.each(model.collection.localStorage.pendingMsgs, function (texto) {
                cadena = cadena.concat(texto);
                cadena = cadena.concat(',/,');
            });
        } else {
            _.each(model.localStorage.pendingMsgs, function (texto) {
                cadena = cadena.concat(texto);
                cadena = cadena.concat(',/,');
            });

        }

        return cadena;
    },

    // true: model
    // false: collection
    isCollectionOrModel: function (objeto) {
        if (objeto.localStorage) {
            return false;
        } else {
            return true;
        }
    },

};

return commons;

});
