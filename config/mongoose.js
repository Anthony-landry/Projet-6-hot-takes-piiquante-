// Récuperer la variable Node env du fichier de configuration.
const env = process.env.NODE_ENV;
console.log("Environnement de :", env);
// Recherche l'index de Node Env dans l'objet config.json
const config = require("./config.json")[env];

// Importe le paquet mongoose.
const mongoose = require("mongoose");

//Initié la connexion au serveur mongoDB.
const mongoose_connection = mongoose.createConnection(
	`mongodb+srv://${config.username}:${config.password}@${config.host}`
);
//Export du module mongoose_connection.
module.exports = mongoose_connection;
