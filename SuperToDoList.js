var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var session = require('cookie-session');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(session({
    secret: "todosecret"
}));

app.use(express.static('views'));

var list = [];

app.get('/', function (req, res) {
    res.render('liste.ejs');
});

io.sockets.on('connection', function (socket) {
    socket.emit('modification', list);

    socket.on('newElementToAdd', function (item) {
        list.push(item);
        console.log(list);
        socket.broadcast.emit('modification', list);
        socket.emit('modification', list);
    });

    socket.on('itemToRemove', function (id) {
        list.splice(id, 1);
        console.log(list);
        socket.broadcast.emit('modification', list);
        socket.emit('modification', list);
    });
});

server.listen(8080);