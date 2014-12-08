require.config({
    paths: {
        jquery:             'lib/jquery/dist/jquery',
        jqm:                'lib/jquery-mobile-bower/js/jquery.mobile-1.4.2',
        jqmConfig:          'app/utils/jqm-config',
        iscrollView:        'libtest/jquery.mobile.iscrollview/jquery.mobile.iscrollview', // Only compatible for iscroll < v4.2
        iscroll:            'libtest/iscroll/iscroll',
        doubleClickFix:     'libtest/iscroll/dblClkFix',

        underscore:         'lib/underscore/underscore',
        backbone:           'lib/backbone-1.1.2/backbone',
        //notifier:         'libtest/backbone/backbone.notifier/backbone.notifier',
        notifier:			'lib/backbone.notifier/js/backbone.notifier',
        stickit:            'lib/backbone.stickit/backbone.stickit',
        cachedStorage:      'libtest/backbone/backbone.cachedStorage/backbone.cachedStorage.retcon',

        APP:                'app/utils/namespace',
        config:             'app/utils/config',
        utils:              'app/utils/utils',
        utilsCordova:       'app/utils/cordova-utils',
        viewCommons:        'app/views/commons/view-commons',
        router:             'app/routers/router',

        cryptoJS:           'libtest/crypto/core-min',
        encBase64:          'libtest/crypto/enc-base64-min',
        checkSHA:           'libtest/crypto/checkSHA',
        sha1:               'libtest/crypto/sha1',

        routerDownload:     'app/routers/router-download'
    },

    shim: {
        backbone: {
            deps:           ['jquery', 'underscore'],
            exports:        'Backbone'
        },

        encBase64:          ['cryptoJS'],
        checkSHA:           ['encBase64', 'sha1'],

        jqmConfig:          ['jquery'],
        jqm:                ['jquery', 'jqmConfig'],
        iscroll: {
            deps:           ['jqm'],
            exports:        'iScroll'
        },
        iscrollView: {
            deps:           ['iscroll']
        },

        underscore: {
            exports:        '_'
        },

        cachedStorage: {
            deps:           ['backbone'] ,
            exports:        'Backbone.LocalStorage'
        },

        notifier: {
            deps:           ['backbone'],
            exports:        'Backbone.Notifier'
        },

        stickit:            ['backbone']

    }
});

requirejs([
    'jquery',
    'jqm',
    'backbone',
    'notifier',
    'APP',
    'utils',
    'utilsCordova',
    'router',
    'stickit',
    'app/collections/user-collection',
    'doubleClickFix',
    'iscrollView',
    'routerDownload'

], function (
    $,
    jqm,
    Backbone,
    notifier,
    APP,
    utils,
    androidUtils,
    Router,
    stickit,
    UserCollection,
    doubleClickFix,
    iscrollView,
    RouterDownload
) {

$(document).ready(function () {


    // Since we are automatically updating the model, we want the model
    // to also hold invalid values, otherwise, we might be validating
    // something else than the user has entered in the form.
    /*Backbone.Validation.configure({
        forceUpdate: true
    });*/

    // Añadir soporte al español para Moment.js.
    /*moment.lang("es");*/

    //Carga si es necesario librerías específicas de Apache Cordova
    androidUtils.loadCordovaLibs();

    //carga de Webintent
    androidUtils.loadWebintent();

    APP.notifier = new Backbone.Notifier();

    utils.tpl.loadTemplates([
        'download/page/download-page'],

        function () {
            APP.router = new RouterDownload();

            Backbone.history.start({
                pushState: false
            });
        });

    APP.loadUsers = function () {
        if (typeof APP.users === 'undefined') {
            APP.users = new UserCollection();
        }

        APP.users.fetch();
    }

    //FUNCION PARA CARGAR LIBRERIA CORDOBA AL INDEX
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
    }

    function onFileSystemSuccess(fileSystem) {
        console.log(fileSystem.name);
        var directoryEntry = fileSystem.root;
        console.log("Sy:" + directoryEntry);
    }
});

});
