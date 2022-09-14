// Importer le modèle des données sauces.
const sauceSchema = require("../schemas/sauce.schema");

// Importer le package "file system" qui permet de modifer le system des fichiers.
const fs = require("fs");

// Fonction pour voir toutes les sauces.
exports.getSauceList = (req, res) => {
	//Méthode find() permet de renvoyer un tableau contenant tous les sauces dans la base de données.
	sauceSchema
		.find()
		.then((sauces) => {
			res.status(200).send(sauces);
		})
		// Erreur : status 400 Bad Request.
		.catch((err) => res.status(400).send(err));
};

// Fonction pour créer une sauce.
exports.createSauces = (req, res) => {
	const sauce = JSON.parse(req.body.sauce);
	let imgConvert = "";

	// Si changement de donnée non prévu coté front, on reinitilaise le heat à 0 ou 10.
	if (sauce.heat < 0) sauce.heat = 0;
	else if (sauce.heat > 10) sauce.heat = 10;

	// Si une image est trouvé on lui construit son URL.
	if (req.file)
		imgConvert =
			req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
	// Sinon une image par défaut est envoyé.
	else
		imgConvert =
			req.protocol + "://" + req.get("host") + "/images/defaut/imagedefaut.png";

	// Ajout de l'attribut imageURL dans l'objet sauce.
	Object.assign(sauce, { imageUrl: imgConvert });

	// Nouvelle instance de sauceSchema pour ajouter dans le nouveau constructeur l'objet sauce.
	const sauces = new sauceSchema(sauce);
	sauces
		.save()
		.then((sauce) => {
			return res
				.status(201)
				.send({ message: "le produit est enregistré", sauce });
		})
		.catch(() => {
			return res
				.status(400)
				.send({ message: "le produit n'est pas enregistré" });
		});
};

// Fonction pour afficher une sauce par son id.
exports.getSauceById = (req, res) => {
	// Requete à la base de donnée pour chercher la sauce en fonction de son id.
	sauceSchema
		.findById({ _id: req.params.id })
		.then((sauce) => {
			Object.assign(sauce, { likes: sauce.usersLiked.length });
			Object.assign(sauce, { dislikes: sauce.usersDisliked.length });
			console.log({ _id: req.params.id }, sauce);
			return res.status(200).send(sauce);
		})
		.catch((error) => {
			return res.status(400).send(error);
		});
};

// Fonction pour modifier une sauce.
exports.modSauceById = (req, res) => {
	let sauce = req.body;
	// Si l'image change, celle ci est mise à jour.
	if (req.file) sauce = parseBodyToIncludeImage(req);
	// Requete à la base de donnée pour chercher la sauce en fonction de son id.
	sauceSchema
		.findByIdAndUpdate({ _id: req.params.id }, sauce)
		.then((status) => {
			if (status == null) {
				// si la sauce n'a pas été trouver.
				return res
					.status(400)
					.send({ message: "La sauce n'a pas été trouvé dans la database" });
			} else {
				// Sinon, Mise à jour de la sauce.
				return res
					.status(200)
					.send({ message: "La sauce a été mise à jour dans la database" });
			}
		})
		.catch((error) => {
			return res.status(400).send({ message: error });
		});
};

// Fonction pour supprimer une sauce.
exports.deleteSauceById = (req, res) => {
	sauceSchema
		.findByIdAndDelete({ _id: req.params.id })
		// Appel de la fonction deleteImage.
		.then((sauce) => deleteImage(sauce))
		.then((sauce) => {
			return res
				.status(200)
				.send({ message: "Cette sauce a été supprimée.", sauce });
		})
		.catch((error) => {
			return res.status(400).send({ message: error });
		});
};

// Fonction pour supprimer une image.
function deleteImage(sauceSchema) {
	// Création d'une string qui correspond au chemin du fichier.
	let newStringUrl = new URL(sauceSchema.imageUrl).pathname;
	// Si la string ne commencer pas par l'emplacement du fichier par défaut.
	if (!newStringUrl.startsWith("/images/defaut/")) {
		//Suppresion du fichier.
		fs.unlinkSync(newStringUrl.substring(1)); //substring(1) supprime le premier caractère du fichier "/"
	}
}

// Fonction pour parse la sauce si changement d'image.
function parseBodyToIncludeImage(req) {
	// Requête à la base de donnée pour chercher la sauce en fonction de son id, si l'image est trouvé, celle-ci est supprimé.
	sauceSchema
		.findById({ _id: req.params.id })
		.then((sauce) => deleteImage(sauce))
		.catch((err) => console.log(err));

	let sauce = JSON.parse(req.body.sauce);

	let imgConvert =
		req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;

	Object.assign(sauce, { imageUrl: imgConvert });

	return sauce;
}
