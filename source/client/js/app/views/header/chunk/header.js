define([
    'underscore',
    'backbone',
    'utils',
    'APP',
    'viewCommons'

], function(_, Backbone, utils, APP, viewCommons){

var Header = Backbone.View.extend({

    initialize: function (parameters) {
        this.parameters = parameters;
        this.template = _.template(utils.tpl.get('header/chunk/header'));
    },

    render: function () {

        var fechaUltimaSincronizacion;
        if (APP.currentUserSincronizacion &&
            typeof APP.currentUserSincronizacion.at("0") != 'undefined' &&
            APP.currentUserSincronizacion.at("0").get("fecha"))
        {
            fechaUltimaSincronizacion =
                new Date(APP.currentUserSincronizacion.at("0").get("fecha")).toLocaleString();
        } else {
            fechaUltimaSincronizacion = 'Nunca';
        }

        var usuario = this.parameters.usuario;
        var isAdmin = false;
        if(typeof usuario !== undefined &&
           usuario !== null &&
           utils.isAdmin(usuario.get('usuario'))){

            isAdmin = true;
        }

        this.$el.empty();
        this.$el.html(this.template({
            botonMenu: this.parameters.botonMenu,
            titulo: this.parameters.titulo,
            usuario: usuario,
            version: APP.config.VERSION_APK,
            fechaUltimaSincronizacion: fechaUltimaSincronizacion,
            isAdmin: isAdmin
        }));

        return this;
    },

    clearLocalStorage: function(){
        utils.clearLocalStorageData();
    },

    events: {
        "click #clearLocalStorage": "clearLocalStorage",
        "click #dataSyncButton": "dataSync",
        "click #checkUpdates": "checkUpdates",
        "click #logout-button": "logout"
    },

    logout: function () {
        event.preventDefault();
        APP.router.navigate("logout", {
            trigger: true
        });
    },

    dataSync: function () {
        event.preventDefault();

        if (APP.transaccion) {

            var confirmMsg = APP.notifier.notify({
                    message: "¿Seguro que desea cancelar?",
                    'type': "info",
                    theme: 'dialog',
                    buttons: [{
                        'data-role': 'ok',
                        text: 'Continuar',
                        'class': 'default'
                }, {
                        'data-role': 'cancel',
                        text: 'Cancelar',
                        'class': 'default'
                }],
                    modal: true,
                    position: 'center',
                    fadeInMs: 0,
                    fadeOutMs: 0,
                    ms: null,
                    destroy: false
                })
                .on('click:ok', function () {

                    // Salvar remitos
                    this.destroy();
                    viewCommons.cargarEntregas(function () {
                        APP.router.navigate("home", {
                            trigger: true
                        });
                    });

                })
                .on('click:cancel', 'destroy');

        } else {
            viewCommons.cargarEntregas(function () {
                APP.router.navigate("home", {
                    trigger: true
                });
            });
        }


    },

    checkUpdates: function () {
        event.preventDefault();
        viewCommons.checkNewVersion();
    },
});

return Header;

});
