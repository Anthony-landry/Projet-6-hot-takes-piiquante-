//Ce fichier contient la configuration pour sécuriser les mots de passe

//importer le schéma des mots de passe
const passwordSchema = require("../schemas/password.schema");

//vérifier si le mot de passe correspond bien au schéma
module.exports = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		return res.status(400).send({
			message:
				"Mot de passe non valide: entre 8 et 20 caractères, au moins une majuscule, une minuscule, un chiffre et sans espace !",
		});
	} else {
		next();
	}
};
