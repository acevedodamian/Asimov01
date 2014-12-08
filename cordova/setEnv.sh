#!/bin/bash

export SCRIPT_BASE=/home/dam/DEV/Asimov01/cordova

export PROJECT_VERSION="011"
export PROJECT_NAME=asimov01
export PROJECT_PACKAGE=com.asimov
export PROJECT_NAME_CASE=Asimov01
export SOURCE_WEB_PROJECT=/home/dam/DEV/Asimov01/source/client/*


export ECLIPSE_ADT_HOME=/u01/software/adt-bundle-linux-x86_64-20140702
if [ ! -d "$ECLIPSE_ADT_HOME" ]; then
	echo No existe el eclipse home definido ...
	exit -1
fi
export ZIPALIGN=$ECLIPSE_ADT_HOME/sdk/build-tools/android-4.4W/
export PATH=$ECLIPSE_ADT_HOME/sdk/platform-tools:$ECLIPSE_ADT_HOME/sdk/tools:$PATH:$ZIPALIGN



