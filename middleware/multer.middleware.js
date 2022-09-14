//  Importe le paquet multer.
const multer = require("multer");

// on définit les images/formats reçu en appartenance de format ( comme un dictionnaire).
const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/bmp": "bmp",
	"image/gif": "gif",
	"image/x-icon": "ico",
	"image/svg+xml": "svg",
	"image/tiff": "tif",
	"image/tif": "tif",
	"image/webp": "webp",
};

// Multer.diskStorage enregistrer le fichier sur le disque.
const storage = multer.diskStorage({
	// Destination choisie ("images)").
	destination: (req, file, callback) => {
		// null dit qu'il n'y a pas eu d'erreur à ce niveau la et 'images' c'est le nom du dossier.
		callback(null, "images");
	},

	// on definit les termes de son appel (nom).
	filename: (req, file, callback) => {
		// Supprime l'extension du nom fichier.
		const name = file.originalname.replace(/\.[^/.]+$/, "");
		// Permet de créer une extension de fichiers correspondant au mimetype (via dictionnaire) envoyé par le frontend.
		const extension = MIME_TYPES[file.mimetype];
		// si le fichier correspond à un fichier image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
		if (file.mimetype in MIME_TYPES) {
			//Nom associé à une date (pour le rendre le plus unique possible) avec un point et son extension.
			callback(null, name + Date.now() + "." + extension);
			// Si ce n'est pas un fichier image.
		} else {
			console.log("fichier non accepté");
			// Le fichier n'étant pas accepter, son nom n'et pas passer en deuxieme argument, et donc remplacé par null.
			callback(null, null);
		}
	},
});

//si le format de l'image n'est pas valide
const fileFilter = (req, file, callback) => {
	// ne pas accepter les mimetype qui ne sont pas des images.
	if (!(file.mimetype in MIME_TYPES)) {
		return callback(
			null,
			false,
			new Error("Le format de l'image n'est autorisé !")
		);
	}
	callback(null, true);
};

// on exporte le fichier via multer qui possede l'objet storage puis
//.single signifie fichier unique (pas un groupe de fichiers) en disant que c'est un fichier 'image'
module.exports = multer({
	storage,
	fileFilter,
	//spécifier les limites peut aider à protéger le site contre les attaques par déni de service (DDoS).
	limits: { fileSize: 500000 },
}).single("image");
