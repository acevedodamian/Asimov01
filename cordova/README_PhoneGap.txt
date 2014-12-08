
Emulador para celulares PhoneGap =======================================


http://docs.phonegap.com/en/3.3.0/guide_cli_index.md.html#The%20Command-Line%20Interface

instalar cordova con el comando npm. 

sudo npm install -g cordova@3.0.0

Debería instalar una superior a 3.0 ( Nota: Yo tuve que forzarlo a la 3.5.0 
sudo npm install -g cordova@3.5.0-0.2.6  se chequea con cordova -version)

tb debe bajarse e instalarse...

- eclipse adt
- apache ant
- jdk 1.8
- git

Agregar a la variable de entorno PATH ( algunos no hace falta depende como se instalen ) :

eclipse-adt\sdk\tools;
eclipse-adt\sdk\platform-tools;
apache-ant-1.9.4\bin;
jdk1.8.0_11\bin;
cordova
git


En el SVN:
/trunk/Fuentes

Se encuentran los siguientes scripts ( tienen variables dependientes del ambiente adentro revisar ) para ejecutar en el siguiente orden

createPhoneGapProject.sh

addPhoneGapPlugins.sh

buildPhoneGapProject.sh    

runADTEmulator.sh

(Notas: 

-para iniciar el emulador antes se debe crear un AVD ( virtual device para el emulador con 'android avd')

-el paquete APK queda en : /phonegap/gdelivery/platforms/android/ant-build
)



Crear devices:

android avd

-------------







Para hacerlo sin los scripts==================================

crear proyecto de cero:

cordova create gdelivery com.garbarino.gdelivery GDelivery

cordova platform add android

(Notas:

1) Con el comando android del Eclipse ADK en el path se puede agregar versiones del SDK de android si estas faltan.

2) En el path: /usr/lib/node_modules/cordova/lib/cordova-android/framework , en un archivo local properties cordova apunta a un SDK ,  el archivo es : local.properties . Se debe apuntar al SDK del ADK. Luego cuando el proyecto se crea usa este local.properties.
)


Para agregar plugins

cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git

cordova plugin add https://github.com/wildabeast/BarcodeScanner.git

Para compilar:

cordova build

cordova prepare

cordova emulate android  

(Nota: para iniciar el emulador

Antes se debe crear un AVD ( virtual device para el emulador con 'android avd')
)


Crear devices:

android avd
