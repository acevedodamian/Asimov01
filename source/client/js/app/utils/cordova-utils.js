define([], function() {

return {

    loadCordovaLibs: function () {
        var fileref;
        if (this.isAndroid() && !this.isBrowser()) {
            console.log("isAndroid() .. loading cordova libs ..");
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", "cordova.js");
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
        if (this.isiOS()) {
            console.log("isiOS() .. loading cordova libs ..");
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", "cordova.js");
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },

    isBrowser: function () {
        return window.location.href.indexOf('http:') > -1;
    },

    isAndroid: function () {
        return navigator.userAgent.indexOf("Android") > 0;
    },

    isiOS: function () {
        return (navigator.userAgent.indexOf("iPhone") > 0 ||
                navigator.userAgent.indexOf("iPad") > 0 ||
                navigator.userAgent.indexOf("iPod") > 0);
    },

    loadWebintent: function () {

        if (window.device) {
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", "webintent.js");
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
};

});
