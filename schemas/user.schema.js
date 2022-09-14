// Importe le module Mongoose.
const mongoose = require("mongoose");
// Importe le fichier de configuration mongoose.
const mongoose_connection = require("../config/mongoose");
// Importe le module mongoose-unique-validator.
const uniqueValidator = require("mongoose-unique-validator");

// Création de schéma de connection d'utilisateur.
const userSchemaStructure = mongoose.Schema({
	// email
	email: { type: String, required: true, unique: true },
	// mot de passe
	password: { type: String, required: true },
});

// Récuperation du schéma pour crée l'bjet user.
const userSchema = mongoose_connection.model("User", userSchemaStructure);

// utilisation du schema via le plugin de mongoose-unique-validator
userSchemaStructure.plugin(uniqueValidator);

// Exports.user = user;
module.exports = userSchema;
