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
        sha1:               'libtest/crypto/sha1'
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
            deps:           ['jquery'],
            exports:        'iscroll'
        },

        iscrollView: {
            deps:           ['jqm', 'iscroll'],
            exports:        'iscrollview'
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
    'iscroll',
    'iscrollView'

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
    iscroll,
    iscrollView
) {

$(document).ready(function () {
    var checkSessionTime = function () {
        if (APP.usuarioActual) {
            if (Math.abs(new Date() - APP.usuarioActual.ultimaActividad) > APP.config.SESSION_TIMEOUT_TIME) {
                APP.usuarioActual = null;

                APP.notifier.destroyAll();
                APP.notifier.notify({
                    message: "Sesión expirada por inactividad",
                    position: 'center',
                    hideOnClick: true,
                    ms: null,
                    modal: true,
                    destroy: true,
                    type: 'error',
                    width: APP.config.POPUP_WIDTH
                });

                APP.router.navigate("login", {
                    trigger: true
                });
            } else {
                APP.usuarioActual.ultimaActividad = new Date();
            }
        }
    }


    // Chequear inactividad cuando hay un evento de tap o mousedown.
    $('body').bind("vmousedown", checkSessionTime);

    //Timeout por defecto ajax
    $.ajaxSetup({
        timeout: parseInt(APP.config.AJAX_TIMEOUT)
    });

    //Carga si es necesario librerías específicas de Apache Cordova
    androidUtils.loadCordovaLibs();
    androidUtils.loadWebintent();

    APP.notifier = new Backbone.Notifier();

	utils.tpl.loadTemplates([
        'footer/chunk/footer',
        'header/chunk/header',
		'home/page/home-page',
        'admin/page/local-storage-page',
        'admin/page/configuration-page',
        'cliente-validacion/page/documento-page',
        'cliente-validacion/page/tarjeta-page',
		'cliente-validacion/page/articulos-page',
		'cliente-validacion/chunk/articulos-list-item',
        'cliente-validacion/chunk/articulos-list-item-resumen',
		'cliente-validacion/chunk/articulos-list-collapsible',
        'cliente-validacion/chunk/list-reci-rech-view',
		'cliente-validacion/page/resumen-page',
		'cliente-validacion/page/firma-page',
		'entrega/page/entrega-list-page',
		'entrega/chunk/entrega-list-item',
        'entrega/page/entrega-resumen-page',
		'remito/page/remito-list-page',
		'remito/chunk/remito-list-item',
		'login/page/login-page',
        'version/page/version-obligatoria'],

		function () {
			APP.router = new Router();

			Backbone.history.start({
				pushState: false
			});
		});

    var loadUsers = function () {
        if (typeof APP.users === 'undefined') {
            APP.users = new UserCollection();
        }

        APP.users.fetch();
    }

    // FUNCION PARA CARGAR LIBRERIA CORDOBA AL INDEX
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
