#!/bin/bash

source $(dirname $0)/setEnv.sh

echo Limpiando carpetas de phonegap ...
rm -rf ./phonegap/$PROJECT_NAME/www/*

echo Copiando carpetas del proyecto web ...
cp -r $SOURCE_WEB_PROJECT ./phonegap/$PROJECT_NAME/www

echo Copiando archivos sueltos ...
cp ./phonegap/config.xml ./phonegap/$PROJECT_NAME
#cp ./phonegap/project.properties ./phonegap/$PROJECT_NAME/platforms/android/project.properties
#cp ./phonegap/proguard.cfg ./phonegap/$PROJECT_NAME/platforms/android/proguard.cfg
cp ./phonegap/AndroidManifest.xml ./phonegap/$PROJECT_NAME/platforms/android/AndroidManifest.xml

export GDELIVERY_ROOT=$PWD

echo Compilando proyecto ...


export FECHA_DE_HOY="$(date +'%Y%d%m')"
export BUILD_NAME="$PROJECT_NAME_CASE-$PROJECT_VERSION-$FECHA_DE_HOY.apk"

if [ ! "$1" == "-sf"  ]; then
	cd ./phonegap/$PROJECT_NAME/www
	cordova build android --release
	cd $GDELIVERY_ROOT

	echo Firmando jar...

	cp Asimov01-release-key.keystore phonegap/$PROJECT_NAME/platforms/android/ant-build/Asimov01-release-key.keystore

	cd phonegap/$PROJECT_NAME/platforms/android/ant-build/

	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore Asimov01-release-key.keystore Asimov01-release-unsigned.apk asimov01

	mv Asimov01-release-unsigned.apk Asimov01-release-signed.apk

	jarsigner -verify -verbose -certs Asimov01-release-signed.apk
	zipalign -fv 4 Asimov01-release-signed.apk $BUILD_NAME
else
	cd ./phonegap/$PROJECT_NAME/www
	cordova build
	cd $GDELIVERY_ROOT

	echo Jar sin firmar...

	cd phonegap/$PROJECT_NAME/platforms/android/ant-build/
	mv Asimov01-release-unsigned.apk $BUILD_NAME
fi

echo build terminado, apk en: $(pwd)/$BUILD_NAME

cordova prepare

#cordova emulate android

