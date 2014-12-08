define([
    'underscore',
    'backbone',
    'APP',
    'utils',
    'app/views/header/chunk/header',
    'app/views/footer/chunk/footer'

], function(_, Backbone, APP, utils, Header, Footer){

var AdminConfigurationPage = Backbone.View.extend({

    initialize: function(){
        this.template = _.template(utils.tpl.get('admin/page/configuration-page'));
        this.title = "Configuracion";
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

		return this;
    },

    events: {
		"keyup #URL_HOST": "setHost",
        "keyup #URL_REST_SVC_BASE": "setRestSVCBase",
        "keyup #URL_SERVICIO_CONTRASENA": "setServicioContrasena",
        "keyup #DOWNLOAD_STORAGE_FOLDER": "setServicioCarpetaDescarga",
        "keyup #AJAX_TIMEOUT": "setAjaxSetupTime",
        "keyup #ADMINS": "setAdmins",
        "keyup #INTENTOS_TARJETA": "setIntentosTarjeta"
    },

    setHost: function () {
        this.saveConfig('URL_HOST');
    },

    setRestSVCBase: function () {
        this.saveConfig('URL_REST_SVC_BASE');
    },

    setServicioContrasena: function () {
        this.saveConfig('URL_SERVICIO_CONTRASENA');
    },

    setServicioCarpetaDescarga: function () {
        this.saveConfig('DOWNLOAD_STORAGE_FOLDER');
    },

    setAjaxSetupTime: function () {
        this.saveConfig('AJAX_TIMEOUT');
    },

    setAdmins: function () {
        this.saveConfig('ADMINS');
    },

    setIntentosTarjeta: function () {
        this.saveConfig('INTENTOS_TARJETA');
    },

    saveConfig: function(attributeName){
         APP.config.changeConfigAttribute(attributeName, $('#'+attributeName).val());
    },

    // Llena el localstorage con basura
    // 1 char in js === 16 bit
/*    fillLocalStorage: function(event) {
        event.preventDefault();

        var currentSize = 0;
        delete localStorage.test;// reset
        for (var x in localStorage){
            //currentSize += Number(((localStorage[x].length) *2 / 1024 / 1024).toFixed(2));
        };
          console.log('--------------');
          console.log('Current localStorage size is: '+currentSize+' MB');
          console.log('--------------');

        var bytesInMb = 1024*1024;
        var iterationsData;

        var n10b =    '0123456789';
        var n100b =   repeat(n10b, 10);
        var n1kib =   repeat(n100b, 10);
        var n10kib =  repeat(n1kib, 10);
        var n100kib = repeat(n10kib, 10);
        var n1mib =   repeat(n100kib, 10);
        var n10mib =  repeat(n1mib, 10);

        var values = [n10b, n100b, n1kib, n10kib, n100kib, n1mib, n10mib];

        iterationsData = [];
        for (var majorIndex = 1; majorIndex < values.length; majorIndex++) {
            var major = values[majorIndex];
            var minor = values[majorIndex - 1];
            for (var i = 1; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    iterationsData.push([major, minor, i, j]);
                }
            }
        }

        var index = 0;
        var oldLength = 0;

        function iteration() {
            var data = iterationsData[index];

            major = data[0];
            minor = data[1];
            i = data[2];
            j = data[3];

            var string = repeat(major, i) + repeat(minor, j);
            var length = '' + string.length;

            if (test(string)) {
                //console.log(length + ' characters were stored successfully.');
            } else {
              console.log('--------------');
              console.log('Filled to localStorage:');
             // console.log((oldLength*2/bytesInMb).toFixed(2) + ' MB');
              console.log('--------------');

              var testFilled = localStorage.test || '';
              delete localStorage.test;
              if(localStorage.testStored){
                localStorage.testStored = localStorage.testStored + testFilled;
              }else{
                 localStorage.testStored = testFilled;
              }
              return;
            }
            oldLength = length;

            index++;
            if (index < iterationsData.length) {
                setTimeout(iteration, 0);
            } else {
                console.log( (oldLength*2/bytesInMb).toFixed(2) + ' MB were saved successfully, test is stopped.');
            }
        }

        iteration();

        function test(value) {
            try {
                localStorage.test = value;
                return true;
            } catch (e) {
                return false;
            }
        }

        function repeat(string, count) {
            var array = [];
            while (count--) {
                array.push(string);
            }
            return array.join('');
        }

    },*/
});

return AdminConfigurationPage;

});
