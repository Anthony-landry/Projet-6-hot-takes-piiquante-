//Ce fichier contient la normalisation de port, la gestion d'erreur et du logging basique au serveur Node

//import du package 'http' qui permet de répondre les requêtes http
const http = require("http");

//import de l'app express du server.conf
const app = require("./server_conf");

//import "dotenv": charger les variables d'environnement stockées dans le fichier .env et protéger les informations de connexion
const dotenv = require("dotenv");
dotenv.config();

//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalizePort(process.env.Port || "3000");

//gestion d'erreur
const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}

	const address = server.address();
	const bind = typeof address === "string" ? "pipe" + address : "port" + port;

	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

//méthode "createServer" permet de créer le serveur Node "app"
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe" + address : "port : " + port;
	console.log("server is running on " + bind);
});

//un écouteur d'évènements est enregistré sur le port
server.listen(port);
