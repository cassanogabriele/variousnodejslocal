/*
On envoie l'objet request, qui est disponible pour le gestionnaire d'upload, c'est "node-formidable" qui se charge de sauvegarder le fichier reçu (pour simplifier : seul des png 
peuvent être transmis). Sous Windows, Node.js n'est pas capable d'écraser un fichier existant, il faut d'abord supprimer le fichier existants présent avant de renommer le novuveau.
*/
function route(handle, pathname, response, request) {
	console.log("Début du traitement de l'URL " + pathname + ".");
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		console.log("Aucun gestionnaire associé à " + pathname);
		response.writeHead(404, {"Content-Type": "text/html"});
		response.write("404 Non trouvé");
		response.end();
	}
}

exports.route = route;