define(['utilsCordova'], function(utilsCordova){
//--------------------------------------------------------------------------------------------------------------
//
// Doubleclick fix for Androids 4.2x where a single tap results
// in a double tap | click
// Credits:
// http://stackoverflow.com/questions/14982864/phonegap-2-4-0-with-android-4-2-strange-double-click-behaviour
//
//--------------------------------------------------------------------------------------------------------------

// Si estamos en algun dispositivo mobile:
if (utilsCordova.isAndroid() || utilsCordova.isiOS() ) {
    console.log("Arreglando doble tap");

    last_click_time = new Date().getTime();
    document.addEventListener('click', function (e) {
        click_time = e['timeStamp'];
        if (click_time && (click_time - last_click_time) < 500) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
        last_click_time = click_time;
    }, true);
}

});
