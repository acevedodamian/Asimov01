Asimov01
========

Javascript software to control a Raspberry Pi based FPV remote controlled robot car

[![license](http://img.shields.io/badge/license-Apache-blue.svg?style=flat)](https://raw.githubusercontent.com/acevedodamian/Asimov01/master/LICENSE)
[![downloads](http://img.shields.io/npm/dm/Asimov01.svg?style=flat)](https://www.npmjs.org/package/Asimov01)
[![build](http://img.shields.io/travis/acevedodamian/Asimov01/master.svg?style=flat)](https://travis-ci.org/acevedodamian/Asimov01)
[![coverage](http://img.shields.io/coveralls/acevedodamian/Asimov01/master.svg?style=flat)](https://coveralls.io/r/acevedodamian/Asimov01)
[![code climate](http://img.shields.io/codeclimate/github/acevedodamian/Asimov01.svg?style=flat)](https://codeclimate.com/github/acevedodamian/Asimov01)
[![dependencies](http://img.shields.io/david/acevedodamian/Asimov01.svg?style=flat)](https://david-dm.org/acevedodamian/Asimov01#info=dependencies&view=table)
[![devDependencies](http://img.shields.io/david/dev/acevedodamian/Asimov01.svg?style=flat)](https://david-dm.org/acevedodamian/Asimov01#info=devDependencies&view=table)


Installation:
=============

If you don't have node.js i suggest installing it using NVM: https://github.com/creationix/nvm
Use node > 10.xx
    nvm use 0.10.28
    cd /Asimov01/source

Install pi blaster:
    https://github.com/sarfata/pi-blaster

Install project's npm dependencies:

    npm install socket.io
    npm install r-pi-gpio
    npm install math-statistics
    npm install readline
    npm install r-pi-usonic

Run 
    node server.js

go to your host url, ie:  http://asimov01:5000


Credits:
========
thanks a lot to people in this great projects:
Software PWM libraries 
    https://github.com/sarfata/pi-blaster
    https://github.com/richardghirst/PiBits/tree/master/ServoBlaster
NPM Module to access Pwm libraries: 
    https://github.com/acevedodamian/pi-blaster.js
GPIO and SR04 sensor library 
    https://github.com/clebert/r-pi-usonic
    https://github.com/clebert/r-pi-gpio
Web Sockets implementation for server communication 
    http://socket.io/
Retcon development team 
    http://www.retcon.com.ar 
    https://www.facebook.com/retconlabs
    
License:
========
Copyright 2014 - Damian Acevedo. Published under the Apache open source license (see full license in LICENSE.txt file).
