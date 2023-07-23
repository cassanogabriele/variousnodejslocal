// Utilisation de socket.io et de express.js.

// Appels à des modules
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {   
	/*
	'nouveau client': envoyé par un nouveau client qui vient de charger la page, il contient son pseudo en paramètre, on l'encode avec "ent.encode()" par sécurité.
	Si le visiteur met du JavaScript dans son pseudo, on peut contrer cela, ensuite il reste à sauvegarder le speudo dans une variable session.
	Donc, dès qu'un pseudo est donné, on le stocke en variable de session et on informe les autres personnes.
	*/
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

	/*
	'message' : envoyé par un client qui veut transmettre un message aux autres personnes connectées, on encode d'abord le message aux autres personnes connectées, par sécurité, 
	pour retirer le JavaScript, notamment, et on le broadcast avec le pseudo issu de la variable de session. Pour envoyer plusieurs données dans un seul paramètre, on les encapsule
	dans un objet JavaScript : {pseudo: socket.pseudo, message: message}).
	Donc, dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes.
	*/     
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

// On lance le serveur à l'écoute du port 8080.
server.listen(8080);
