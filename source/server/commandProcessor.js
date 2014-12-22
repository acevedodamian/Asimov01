var piServoBlaster = require('pi-servo-blaster.js')

/*
commandProcessor.js
Server commands parser implementation
*/
module.exports = {
    processCommand: function (data) {
        var resp = '';

        //Evaluates commands
        if (typeof data["command"] !== 'undefined' && data["command"] !== '') {
            switch (data["command"]) {
            case "reload":
                process.exit(0);
                break;
            }
        }

        //Evaluates javascript for testing purposes
        if (typeof data["evalJS"] !== 'undefined' && data["evalJS"] !== '') {

            console.log('Evaluating JS: ' + data["evalJS"]);

            try {
                resp = util.inspect(eval(data["evalJS"]));
                console.log('Response: ' + resp);

            } catch (e) {
                resp = 'Error: ' + e;
                console.error(resp);
            }
        }
        return resp;
    },
};
