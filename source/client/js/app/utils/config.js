define(['utils'], function(utils) {

var configuration = {
    versionPrefix: 'NUEVA_VERSION-',

    // Si la version de la applicacion es mayor a la guardada en el local storage
    // limpiar el local storage.
    checkConfigVersion: function(){
        // Sino existe la version es nueva.
        if(localStorage.getItem(this.versionPrefix+this.VERSION_APK) === null){
            utils.clearLocalStorage();
            console.log("Version nueva, limpiando todo el local storage");
        }

        localStorage.setItem(this.versionPrefix + this.VERSION_APK, false);
    },

    // Prefijo usado al guardar al local storage.
    lsPrefix: 'CONFIG-',

    // Chequea antes si existe la variable en el localstorage.
    checkLocalStorageAndSet: function(configAttributeName, defaultValue){
        if (!localStorage.getItem(this.lsPrefix + configAttributeName)) {
            this[configAttributeName] = defaultValue;
            localStorage.setItem(this.lsPrefix + configAttributeName, defaultValue);
        } else {
            this[configAttributeName] = localStorage.getItem(this.lsPrefix + configAttributeName);
        }
    },

    // Cambia la configuracion y tambien la guarda en el localstorage.
    changeConfigAttribute: function(configAttributeName, value){
        this[configAttributeName] = value;
        localStorage.setItem(this.lsPrefix + configAttributeName, value);
    },

    URL_HOST: null,
    URL_REST_SVC_BASE: null,
    URL_SERVICIO_CONTRASENA: null,

    DOWNLOAD_STORAGE_FOLDER: null,
    AJAX_TIMEOUT: null,
    POPUP_DEFAULT_TIME: 1500,        // ms
    POPUP_WIDTH: 350,
    POPUP_FADE_IN: 300,              // ms
    POPUP_FADE_OUT: 1000,            // ms
    INTENTOS_TARJETA: null,
    VERSION_APK: "0.0.10", //SEGUIR DESDE LA 0.1.1 /////////////////////////////
    SESSION_TIMEOUT_TIME: 600000,    // ms
    ADMINS: null,
};

configuration.checkConfigVersion();

configuration.checkLocalStorageAndSet("AJAX_TIMEOUT", "6000"); // --> Default timeout para ajax, al dar timeout se manejan por el cache local.
configuration.checkLocalStorageAndSet("ADMINS", "exnrobles exdacevedo mobiletest01"); // --> Default admins de desarrollo
configuration.checkLocalStorageAndSet("INTENTOS_TARJETA", 20);
configuration.checkLocalStorageAndSet("DOWNLOAD_STORAGE_FOLDER", "GDelivery");

//configuration.checkLocalStorageAndSet("URL_HOST", "http://cloud1.retcon.com.ar:8080/pup-jaxrs");   //--> Ambiente de Desarrollo Retcon
//configuration.checkLocalStorageAndSet("URL_HOST", "http://gdelivwsdesa.garba.com.ar/pup-jaxrs"); // --> Ambiente de Desarrollo
//configuration.checkLocalStorageAndSet("URL_HOST", "http://gdelivwstest.garba.com.ar/pup-jaxrs"); // --> Ambiente de Test

//configuration.checkLocalStorageAndSet("URL_HOST", "http://186.153.135.142:7096/pup-jaxrs"); // --> Ambiente de Test IP
configuration.checkLocalStorageAndSet("URL_HOST", "http://192.168.1.201:8150/pup-jaxrs");

//configuration.checkLocalStorageAndSet("URL_HOST", "http://gdelivws.garba.com.ar/pup-jaxrs");  // --> Ambiente de Produccion

configuration.checkLocalStorageAndSet("URL_REST_SVC_BASE", "/rest");

//configuration.checkLocalStorageAndSet("URL_SERVICIO_CONTRASENA", "http://smdmztest.garbarino.com.ar/session-manager-web/rest/user");
configuration.checkLocalStorageAndSet("URL_SERVICIO_CONTRASENA", "http://186.153.135.142:7097/session-manager-web/rest/user");

//configuration.checkLocalStorageAndSet("URL_SERVICIO_CONTRASENA", "http://cloud1.retcon.com.ar:4321/api/users2"); //--> Mock Ambiente de Desarrollo Retcon

return configuration;

});




