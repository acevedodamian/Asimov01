define([
    'underscore',
    'backbone',
    'APP',
    'utils',
    'app/views/header/chunk/header',
    'app/views/footer/chunk/footer'

], function(_, Backbone, APP, utils, Header, Footer){

var LocalStoragePage = Backbone.View.extend({

    initialize: function(){
        this.template = _.template(utils.tpl.get('admin/page/local-storage-page'));
        this.title = "Almacenamiento local";
        this.self = this;
    },

    render: function(){
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
            botonInicio: true,
            botonVolver: true,
            botonContinuar: false,
            botonFinalizar: false
        }).render();

        list = this.$el.find('#list');

        for (var key in localStorage) {
            var attributes = "";
            try {
                value = JSON.parse(localStorage[key]);

                for (var attribute in value ){
                    attributes += attribute + ": '" + value[attribute] + "' ";
                    if (attributes.length > 150) break;
                }
            } catch (err) {
                attributes = localStorage[key];
            }

            list.append("<li><a data-position-to='window'><h1 id='" +
                key + "' class='key'>" + key + "<br/>" +
                attributes + "</h1></a><a id='"+key+"' class='delete-key'></a></li>");
        }

		return this;
    },

    onClickKey: function (event) {
        var dialog = $("#keyDetail");
        dialog.find("#keyDetailContent").html("<p>"+localStorage.getItem(event.target.id) + "</p>");
        dialog.popup("open");
    },

    onClickDeleteKey: function(event){
        localStorage.removeItem(event.target.id);
        this.$el.find('#'+event.target.id).closest('li').remove();
    },

    events: {
		"click .key": "onClickKey",
        "click .delete-key": "onClickDeleteKey",
    },

});

return LocalStoragePage;

});
