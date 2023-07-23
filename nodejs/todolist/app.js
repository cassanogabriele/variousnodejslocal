// Retourne une référence de fonction qui est appelée avec express().
var express = require('express');
// Chargement du middleware de sessions
var session = require('cookie-session');
// Chargement du middleware de gestion des paramètres
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// Création d'un objet app en appelant la fonction express().
var app = express();

// Utilisation des sessions.
app.use(session({secret: 'todotopsecret'}))

// S'il n'y a pas de todolist dans la session, on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

// Gestion des routes : on indique les différentes route à laquelle l'application doit répondre (ici route : /todo), une fonction de callback est appelée quand quelqu'un demande 
// cette route.

// Affichage de la todolist la todolist et du formulaire.  */
.get('/todo', function(req, res) { 
    res.render('todo.ejs', {todolist: req.session.todolist});
})

// Ajout d'un élément à la todolist. 
.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

// Suppressison d'un élément de la todolist 
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

// Redirection vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/todo');
})

// Ecoute du port 8080.
.listen(8080);   