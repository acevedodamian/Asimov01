/*
CheckSSHA1 v1.0.0
(c) 2004-2014 Rotten the Genius
*/


function checkSSHA(hash, strPassword) {

        //Remove the SSHA label
        hash = hash.substring(6,hash.length);



        // Decode the Hash
        var words = CryptoJS.enc.Base64.parse(hash);
        var wSalt = words.clone();
        wSalt.words = wSalt.words.slice(5);
        wSalt.sigBytes = 8;


        var wPass  = CryptoJS.enc.Latin1.parse(strPassword);

        var tmpSha1 = CryptoJS.algo.SHA1.create();
        tmpSha1.update(wPass);
        tmpSha1.update(wSalt);
        var sha1 = tmpSha1.finalize();


        var sha1 = sha1.concat(wSalt);


        var encodedSha1 = CryptoJS.enc.Base64.stringify(sha1);


        return encodedSha1 !== "" && encodedSha1 === hash;
    }

