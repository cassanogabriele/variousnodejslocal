/*
On installe le module "formidable" qui rend tous les éléments du formulaire reçu depuis une requête HTTP de type POST facilement accessible depuis Node.js. Il faut juste créer un objet 
incomingForm qui est une représentation du formulaire reçu et qui peut être parcouru depuis l'objet request du serveur HTTP, auant pour les champs du formulaire que pour les fichiers.
On a besoin d'inclure le traitement des éléments du formulaire reçus par formidable dans le code de l'application, on doit aussi trouver comment renvoyer l'image récupérée. On 
utilise donc le servuer pour lire le contenu du fichier, avec le module "fs". 

Il faut : 

- ajouter un champ de formulaire de type fichier sur la page /start
- intégrer "non-formidable" au gestionnaire upload pour sauvegarder le fichier reçu
- renvoyer l'image récupérée dans le contenu HTML de /upload.

Pour gérer la récupération de l'image dans le gestionnaire "upload", il faut passer l'objet request à la méthode "form.parse" de "node-formidable". On va devoir passer l'objet request 
du serveur au routeur puis au gestionnaire de requêtes.
*/
var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");
	
	function start(response) {
		console.log("Le gestionnaire 'start' est appelé.");
		var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" '+
		'content="text/html; charset=UTF-8" />'+
		'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">'+
		'<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>'+		
		'</head>'+
		'<body style="background-color:black;">'+
		'<div class="jumbotron"><h1>Téléchargement d\'image et affichage de l\image téléchargée</h1>'+
		// On ajoute un attribut "multipart/form-data" au formulaire, on prévoit un champ de type "file" et on définit le libellé du bouton comme "Transférer le fichier".
		'<form action="/upload" enctype="multipart/form-data" '+
		'method="post">'+
		'<div class="form-group">'+
		'<br><br>'+
		'<label for="exampleFormControlFile1"><h3>Téléchargement de l\'image</h3></label>'+
		'<br><br>'+
		'<input class="form-control-file" type="file" name="upload" multiple="multiple">'+
		'<br>'+
		'<input type="submit" value="Transférer le fichier" />'+
		'</div>'+
		'</form>'+
		'</div>'+		
		'</body>'+
		'</html>';
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();
	}

	function upload(response, request) {
		console.log("Le gestionnaire 'upload' est appelé.");
		var form = new formidable.IncomingForm();
		console.log("Récupération des éléments reçus");
		form.parse(request, function(error, fields, files) {
		console.log("Traitement terminé");
		/* En cas d'erreur sous Windows&#160;:
		tentative d'écrasement d'un fichier existant */
		fs.rename(files.upload.path, "/tmp/test.png", function(err) {
		if (err) {
			fs.unlink("/tmp/test.png");
			fs.rename(files.upload.path, "/tmp/test.png");
		}
	});
	
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<h1 style='color:white;text-align:center;'>Reception de l'image</h1><br><br>");
		response.write("<body style='background-color:black;'><p style='text-align:center;'><img width='450px' height='750px' src='/show'/></p></body>");
		response.end();
	});
}
	function show(response) {
		console.log("Le gestionnaire 'show' est appelé.");
		fs.readFile("/tmp/test.png", "binary", function(error, file) {
			if(error) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(error + "\n");
				response.end();
			} else {
				response.writeHead(200, {"Content-Type": "image/png"});
				response.write(file, "binary");
				response.end();
			}
		});
	}
exports.start = start;
exports.upload = upload;
exports.show = show;