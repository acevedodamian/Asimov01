var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , url= require('url')
  , fs = require('fs')
  , util = require('util')
  , commProc = require('./server/commandProcessor.js')
  , piblaster = require('pi-blaster.js')
//  , servoblaster = require('servo-blaster.js')   //TODO:como hacer esta lib ?
  , usonic = require('r-pi-usonic')
;

app.listen(5000);

// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;

    try{
        // Managing the root route
        if (path == '/') {
            index = fs.readFile(__dirname+'/client/index.html',
                function(error,data) {

                    if (error) {
                        res.writeHead(500);
                        return res.end("Error: unable to load index.html");
                    }

                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end(data);
                });
        // Managing the route for the javascript files
        } else if( /\.(js)$/.test(path) ) {
            index = fs.readFile(__dirname+'/client'+path,
                function(error,data) {

                    if (error) {
                        res.writeHead(500);
                        return res.end("Error: unable to load " + path);
                    }

                    res.writeHead(200,{'Content-Type': 'text/plain'});
                    res.end(data);
                });
        } else if( /\.(html)$/.test(path) ) {
            index = fs.readFile(__dirname+'/client'+path,
                function(error,data) {

                    if (error) {
                        res.writeHead(500);
                        return res.end("Error: unable to load " + path);
                    }

                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end(data);
                });

        } else {
                index = fs.readFile(__dirname+'/client'+path,
                function(error,data) {

                    if (error) {
                        res.writeHead(500);
                        return res.end("Error: unable to load " + path);
                    }

                    res.writeHead(200,{});
                    res.end(data);
                });
        }

    } catch (e) {
        console.error("Error: " + e);
        console.info("Sending Error: 404 - File not found.");

        res.writeHead(404);
        res.end("Error: 404 - File not found.");

    }

}

        // Web Socket Connection
    io.sockets.on('connection', function (socket) {

            console.info('Connection established from: ' + socket.handshake.address + ', socket.handshake: ' + util.inspect(socket.handshake));

            // If we recieved a command from a client to start watering lets do so
            socket.on('asimovCommandReq', function (data) {
                var resp = '';
                console.log("Command received: " + JSON.stringify(data));

                resp = commProc.processCommand(data);

                socket.emit("asimovCommandRes", {
                    'response': resp
                });

            });

    });


