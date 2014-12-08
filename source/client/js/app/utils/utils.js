define(['jquery', 'underscore'], function($, _) {

var utils = {};

utils.notifyError = function (mensaje) {
    require(["APP"], function(APP) {
        APP.notifier.destroyAll();
        APP.notifier.notify({
            message: mensaje,
            position: 'center',
            hideOnClick: true,
            ms: null,
            modal: true,
            destroy: true,
            type: 'error',
            width: APP.config.POPUP_WIDTH
        });
    });
};

utils.notifyNormal = function(mensaje){
    require(["APP"], function(APP) {
        APP.notifier.destroyAll();
        APP.notifier.notify({
            message: mensaje,
            position: 'center',
            modal: true,
            fadeInMs: APP.config.POPUP_FADE_IN,
            fadeOutMs: APP.config.POPUP_FADE_OUT,
            ms: APP.config.POPUP_DEFAULT_TIME,
            width: APP.config.POPUP_WIDTH
        });
    });
};

utils.isLetterOrNumber = function (e) {
    if ((e.keyCode >= 48) && (e.keyCode <= 57))
        return true;
    if ((e.keyCode >= 65) && (e.keyCode <= 90))
        return true;
    if ((e.keyCode >= 97) && (e.keyCode <= 122))
        return true;
    return false;
};

utils.isNumber = function (e) {
    if ((e.keyCode >= 48) && (e.keyCode <= 57))
        return true;
    return false;
};

// Remplaza un caracter  en toda una cadena
utils.replaceAll = function (text, busca, reemplaza) {

    while (text.toString().indexOf(busca) != -1)

        text = text.toString().replace(busca, reemplaza);

    return text;

};

utils.filterCollection = function (collection, filterValue) {
    filterValue = filterValue.toLowerCase();
    return collection.filter(function (data) {
        return _.some(_.values(data.toJSON()), function (value) {
            if (_.isNumber(value)) value = value.toString();
            if (_.isString(value)) return value.toLowerCase().indexOf(filterValue) != -1;
            return false;
        });
    });
};

utils.clearLocalStorageData = function () {
    for (var key in localStorage) {
        if (key.search(APP.config.lsPrefix) == -1) {
            localStorage.removeItem(key);
        }
    }
};

utils.clearLocalStorage = function () {
    for (var key in localStorage) {
        localStorage.removeItem(key);
    }
};

utils.isAdmin = function(userName){
    var APP = require('APP');
    var admin = _.find(
        APP.config.ADMINS.split(" "),
        function(admin){ return admin == userName; }
    );

    return admin;
};

utils.tpl = {
    // Hash of preloaded templates for the app
    templates: {},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates: function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            $.get('tpl/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        };
        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    }
};

return utils;

});
