var restify = require('restify');

var server = restify.createServer({
    name: 'chrome-stt-server'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
var xal = require('../../xal-javascript');

server.post('/', function(req, res, next) {
    console.log(req.params);
    var message = req.params.stt;
    console.log(message);
    res.send("STT Okay");
    message = message.replace(/\bp m\b/ig, 'pm');
    message = message.replace(/\ba m\b/ig, 'am');
    message = message.replace(/\bbm\b/ig, 'pm');
    message = message.replace(/\b(\d\d)(\d\d) (am|pm)\b/, "$1:$2 $3");
    xal.log.info("Received STT:", message);
    xal.createEvent('xi.event.input.text', function(state, done) {
        state.put('xi.event.input.text', message);
        done(state);
    });
    next();
});

xal.start({name: 'chrome-stt'}, function() {
    server.listen(9876, function() {
        xal.log.info('Chrome-STT Server: Listening on port 9876');
    });
});
