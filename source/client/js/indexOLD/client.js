//var socket = io.connect('http://localhost:5000');
var socket = io.connect('http://asimov01.retcon.com.ar:5000');

socket.on('asimovCommandRes', function (data) {
    console.log("pong: " + JSON.stringify(data));
});

socket.on('reconnect',function(){
    console.log("succesfully reconected fired");
});

socket.on('reconnecting',function(){
    console.log("trying to reconnect fired");
});

socket.on('reconnect_failed',function(){
    console.log("reconnect failed fired");
});

socket.on('error',function(){
    console.log("Connection error fired");
});


$(document).ready(function() {

//test called ping pong button
    $("#hello").click(function(){
        socket.emit('asimovCommandReq', { duration: 2 });
    });

//Creates this console
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
        greetings: 'Asimov01 Javascript Interpreter',
        name: 'js_demo',
        height: 200,
        prompt: 'Asimov01 js> '});
    });
});
