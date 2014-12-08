define([
    'backbone',
    'underscore',
    'APP',
    'utils',
    'viewCommons',
    'app/models/credentials',
    'app/collections/user-sm-collection',
    'app/collections/user-collection',
    'app/collections/version-collection',
    'checkSHA'

], function(
    Backbone,
    _,
    APP,
    utils,
    viewCommons,
    Credentials,
    UserSMCollection,
    UserCollection,
    VersionCollection,
    checkSHA
) {

var Download = Backbone.View.extend({

    model: new Credentials(),

    bindings: {
        '[name=usuario]': {
            observe: 'usuario',
            setOptions: {
                validate: true
            }
        },
        '[name=contrasena]': {
            observe: 'contrasena',
            setOptions: {
                validate: true
            }
        },
    },

    initialize: function () {
        this.template = _.template(utils.tpl.get('download/page/download-page'));
    },

    events: {
        "click #login-button": "login"
    },

    render: function (eventName) {
        this.model.set("usuario", "");
        this.model.set("contrasena", "");

        this.$el.html(this.template(this.model.toJSON()));
        this.stickit();

        return this;
    },

    login: function (event) {
        event.preventDefault(); // Don't let this button submit the form

        var self = this;
        var usuario = this.model.get('usuario');
        var contrasena = this.model.get('contrasena');

        APP.notifier.notify({
            message: "Iniciando descarga...",
            position: 'center',
            fadeInMs: 0,
            fadeOutMs: 0,
            ms: null,
            modal: true,
            loader: true,
            destroy: false,
            width: APP.config.POPUP_WIDTH
        });

        APP.usuarioSM = new UserSMCollection();
        APP.usuarioSM.username = usuario;
        APP.usuarioSM.password = contrasena;
        APP.usuarioSM.fetch({
            success: function (model, response, options) {
                console.log('Success usuarios hash: ', APP.usuarioSM);
                    if (!_.find(APP.usuarioSM.models, function(model){
                            return model.get('username') == usuario;
                        })) {

                        utils.notifyError('Credenciales inv&aacute;lidas o debe ' +
                        'iniciar sesi&oacute;n al menos una vez con acceso a la red con este usuario!');
                    } else {
                        self.onUserHashFound(usuario, contrasena);
                    }
                },
            error: function(model, response, options) {
                console.error('Error fetch usuarios hash: ', response);
                utils.notifyError('Credenciales inv&aacute;lidas o debe ' +
                'iniciar sesi&oacute;n al menos una vez con acceso a la red con este usuario!');
            }
        });

        // Clear username and password
        $('#usuario').val('');
        $('#password').val('');
    },

    onUserHashFound: function (usuario, contrasena) {

        APP.currentUser = null;
        var hash = "";
        var usuarioHash = APP.usuarioSM.models[0]; //Its only one.

        if (usuarioHash) {
            hash = usuarioHash.get('password');
        }

        if (checkSHA.check(hash, contrasena)) {
            APP.usuarios =
                new UserCollection(null, {contrasena: contrasena, usuario: usuario});

            APP.usuarios.fetch({
                success: function () {
                    console.log("Success fetch usuarios");

                    var busquedaUsuario = APP.usuarios.findWhere({'usuario': usuario});

                    if (busquedaUsuario) {
                        APP.usuarioActual = busquedaUsuario;
                        APP.notifier.destroyAll();

                        var version = new VersionCollection();
                        version.fetch({
                            success: function () {
                                //SI EXISTE
                                APP.version = version;
                                if (APP.version !== null) {
                                    //versionDescarga
                                    APP.notifier.destroyAll();
                                    viewCommons.descarga();
                                }
                            },
                        });

                    } else {
                        utils.notifyError("Credenciales inv&aacute;lidas!");
                    }
                },
                error: function (model, response, options) {
                    APP.notifier.destroyAll();
                    console.error("usuarios fetch: " + JSON.stringify(response));
                    utils.notifyError('Credenciales inv&aacute;lidas o debe ' +
                        'iniciar sesi&oacute;n al menos una vez con acceso a la red con este usuario!');
                },
            });

        } else {
            utils.notifyError("Credenciales inv&aacute;lidas!");
        }
    },

    buscarUsuario: function (usuario, contrasena) {
        return APP.usuarios.findWhere({'usuario': usuario});
    },

});

return Download;

});
