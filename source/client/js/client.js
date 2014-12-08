var socket = io.connect('http://asimov01.retcon.com.ar:5000');

socket.on('asimovCommandRes', function (data) {
    console.log("pong: " + JSON.stringify(data));
});

$(document).ready(function() {

    $("#hello").click(function(){
        socket.emit('asimovCommandReq', { duration: 2 });
    });

    jQuery(function($, undefined) {
    $('#term_demo').terminal(function(command, term) {
        if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    term.echo(new String(result));
                }
            } catch(e) {
                term.error(new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: 'Javascript Interpreter',
        name: 'js_demo',
        height: 200,
        prompt: 'js> '});
});
});
