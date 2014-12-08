#!/bin/bash

source $(dirname $0)/setEnv.sh

echo Limpiando carpetas de phonegap ...
rm -rf $SCRIPT_BASE/phonegap/$PROJECT_NAME

cd $SCRIPT_BASE/phonegap

echo Creando proyecto ...
cordova create $PROJECT_NAME $PROJECT_PACKAGE $PROJECT_NAME_CASE

echo Agregando android ...

cd $PROJECT_NAME
cordova platform add android

$SCRIPT_BASE/addPhoneGapPlugins.sh

echo Copiando contenido carpeta "phonegap/platform/android/res"

rm -rf $SCRIPT_BASE/phonegap/$PROJECT_NAME/platforms/android/res

cp -R $SCRIPT_BASE/phonegap/platforms/android/res $SCRIPT_BASE/phonegap/$PROJECT_NAME/platforms/android/res
