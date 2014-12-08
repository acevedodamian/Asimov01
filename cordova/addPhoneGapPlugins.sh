#!/bin/bash

echo Agregando plugins ...

source $(dirname $0)/setEnv.sh

cd $SCRIPT_BASE/phonegap/$PROJECT_NAME

cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git

cordova plugin add https://github.com/apache/cordova-plugin-console.git

cordova plugin add org.apache.cordova.device

cordova plugin add org.apache.cordova.network-information

cordova plugin add org.apache.cordova.file-transfer

cordova plugin add org.apache.cordova.file

cordova plugin add https://github.com/Initsogar/cordova-webintent.git
