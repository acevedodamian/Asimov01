define([
    'jquery',
    'backbone',
    'underscore',
    'APP',
    'utils',
    'iscrollView',
    'app/views/download/page/download-page'

], function(
    $,
    Backbone,
    _,
    APP,
    utils,
    iscrollView,
    DownloadPage
){

var RouterDownload = Backbone.Router.extend({

    routes: {
        "": "download",
        "download": "download",
    },

    initialize: function () {
        var self = this;
        this.firstPage = true;
    },

    download: function () {
        this.changePage(new DownloadPage());
    },

    changePage: function (page) {
        page.$el.attr('data-role', 'page');
        page.$el.attr('data-title', page.title);
        page.render();
        $('body').append($(page.el));

        var transition = $.mobile.defaultPageTransition;
        if (page.transition) {
            transition = page.transition;
        }
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }

        $.mobile.changePage($(page.el), {
            changeHash: false,
            transition: this.back ? 'slide' : transition,
            reverse: this.back
        });

        this.back = false;

        // Remove page from DOM when it's being replaced
        $('div[data-role="page"]').on('pagehide', function (event, ui) {
            $(event.currentTarget).remove();
        });
    },
});

return RouterDownload;

});
