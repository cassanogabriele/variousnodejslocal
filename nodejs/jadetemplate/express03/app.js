var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var path = require('path');

// On initialise un objet "app" dont on configure le port à écouter, le moteur de template Jade et le répertoire o$ les templates sont stockés (le sous-répertoire "views") et le 
// répertoire des ressources statiques (le sous-répertoire "public").
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

/*
On appelle la méthode "get" mais au lieu de lui donner la fonction directement lors de l'appel, on lui donne une référence vers la fonction déclarée ailleurs. Les fonctions "route.index" 
et "user.list" sont définies respectivement dans les fichiers "route/index.js" et "routes/user.js".
*/
app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
 console.log('Express server listening on port ' + app.get('port'));
});
