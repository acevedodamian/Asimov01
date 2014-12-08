/*
    CheckSHA1 v1.0.0
    (c) 2004-2014 Maxi
*/

define([], function(){

    var f = function(hash, strPassword) {
        var SHA1 = CryptoJS.SHA1(strPassword);
        var newHash = SHA1.toString(CryptoJS.enc.Base64);

        return newHash !== "" && newHash === hash;
    }

    return {check: f};
});




