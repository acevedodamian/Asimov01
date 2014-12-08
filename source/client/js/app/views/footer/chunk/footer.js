define([
    'underscore',
    'backbone',
    'utils'

], function(_, Backbone, utils){

var Footer = Backbone.View.extend({

    initialize: function (parameters) {
        this.parameters = parameters;
        this.template = _.template(utils.tpl.get('footer/chunk/footer'));
    },

    render: function () {
        this.$el.empty();
        this.$el.html(this.template(this.parameters));
        return this;
    },

});

return Footer;

});
