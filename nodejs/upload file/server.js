var http = require("http");
var url = require("url");

// On ajoute la transmission de l'objet request au routeur.
function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Requête reçue pour le chemin " + pathname + ".");
		route(handle, pathname, response, request);
	}
	
	// Lancement de l'application via le serveur sur le port 8888.
	http.createServer(onRequest).listen(8888);
	console.log("Démarrage du serveur.");
}

exports.start = start;