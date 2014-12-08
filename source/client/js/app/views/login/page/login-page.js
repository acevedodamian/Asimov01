define([
    'underscore',
    'backbone',
    'utils',
    'APP',
    'viewCommons',
    'app/models/credentials',
    'app/views/header/chunk/header',
    'app/collections/user-collection',
    'app/collections/user-sm-collection',
    'checkSHA'

], function(_,
            Backbone,
            utils,
            APP,
            viewCommons,
            Credentials,
            Header,
            UserCollection,
            UserSMCollection,
            checkSHA){

var LoginPage = Backbone.View.extend({

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
        this.template = _.template(utils.tpl.get('login/page/login-page'));
        this.title = "Autenticación";
    },

    events: {
        "click #login-button": "login"
    },

    render: function (eventName) {
        this.model.set("usuario", "");
        this.model.set("contrasena", "");

        this.$el.html(this.template(this.model.toJSON()));
        this.stickit();

        var self = this;
        new Header({
            el: this.$el.find('#header'),
            titulo: this.title,
            botonMenu: false,
            usuario: null
        }).render();

        return this;
    },

    login: function (event) {
        event.preventDefault(); // Don't let this button submit the form

        var self = this;
        var usuario = this.model.get('usuario');
        var contrasena = this.model.get('contrasena');

        APP.notifier.notify({
            message: "Iniciando sesión...",
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
    },

    onUserHashFound: function (usuario, contrasena) {

        APP.currentUser = null;
        var hash = "";
        var usuarioHash = APP.usuarioSM.models[0]; //Its only one.

        if (usuarioHash) {
            hash = usuarioHash.get('password');
        }

        if (checkSHA.check(hash, contrasena)) {
            APP.usuarios = new UserCollection(null, {contrasena: contrasena, usuario: usuario});

            APP.usuarios.fetch({
                success: function () {
                    console.log("Success fetch usuarios");

                    var busquedaUsuario = APP.usuarios.findWhere({'usuario': usuario});

                    if (busquedaUsuario) {
                        APP.usuarioActual = busquedaUsuario;
                        APP.notifier.destroyAll();
                        APP.logeadoRecien = 1;
                        APP.usuarioActual.ultimaActividad = new Date();
                        viewCommons.cargarEntregas(function () {
                            APP.router.navigate("home", {
                                trigger: true
                            });
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

    remove: function () {
        // Remove the validation binding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }

});

return LoginPage;

});
