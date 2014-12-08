define([
    'underscore',
    'backbone',
    'utils',
    'APP',
    'app/views/header/chunk/header',
    'app/views/footer/chunk/footer',

], function(_, Backbone, utils, APP, Header, Footer){

var HomePage = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(utils.tpl.get('home/page/home-page'));
        this.title = "Inicio";
        this.transition = "slide";
    },

    render: function (eventName) {
        var homeValues = {
            logged: true
        };

        this.$el.empty();
        this.$el.html(this.template());

        new Header({
            el: this.$el.find('#header'),
            titulo: this.title,
            botonMenu: true,
            usuario: APP.usuarioActual
        }).render();

        new Footer({
            el: this.$el.find('#footer'),
            botonInicio: false,
            botonVolver: false,
            botonContinuar: false,
            botonFinalizar: false
        }).render();

        return this;
    },

    events: {
        "click #entregaList-button": "entregaList",
        "click #clienteValidacionDocumento-button": "clienteValidacionDocumento"
    },

    entregaList: function (event) {
        event.preventDefault(); // Don't let this button submit the for

        APP.router.navigate("entregaList", {
            trigger: true
        });
    },

    clienteValidacionDocumento: function (event) {
        event.preventDefault(); // Don't let this button submit the form

        APP.router.navigate("clienteValidacionDocumento", {
            trigger: true
        });
    },
});

return HomePage;

});
