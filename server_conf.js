//"require" = indique à JavaScript d'importer la totalité des modules demandées.

// Importe le paquet express.
const express = require("express");
// Importe le paquet cors (middleware).
const cors = require("cors");
//importe le paquet path(déjà présent avec node), donne accés au chemin du système de fichiers
const path = require("path");
// Créer un application express.
const app = express();
//Envoi le contenu du fichier .env dans l'object process.env
require("dotenv").config();
// Importe le paquet helmet, il est utilisé pour sécuriser vos en-têtes http. https://blog.risingstack.com/node-js-security-checklist/ https://expressjs.com/fr/advanced/best-practice-security.html
const helmet = require("helmet");
// Importe le paquet express-mongo-sanitize
const mongoSanitize = require("express-mongo-sanitize");
// Importe le express-rate-limit
const rateLimit = require("express-rate-limit");
// Importe le paquet morgan
const morgan = require("morgan");

// MIDDLEWARE //

//Utilisation de morgan en mode dev "format consis"
app.use(morgan("dev"));

// middleware d'helmet
app.use(helmet());

//protèger l'appli de certaines vulnerabilités en configurant les en-têtes
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Fonction Middleware pour gérer les requêtes cross-origin.
app.use(cors());

//permettre aux deux ports (front et end) de communiquer entre eux
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*"); //permet d'accéder l'API depuis n'importe quelle origine ('*')
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	); //ajouter les headers mentionnés aux requêtes envoyées vers notre API
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	); //Permet d'envoyer des requêtes avec les méthodes mentionnées
	next();
});

//Fonction middleware intégrée dans Express. Il analyse les requests entrantes avec des charges utiles codées en URL et est basé sur un analyseur de corps.
app.use(
	express.urlencoded({
		extended: true,
	})
);
//Fonction middleware intégrée dans Express. Il analyse les requests entrantes avec des charges utiles JSON et est basé sur body-parser
app.use(express.json());

//Fonction autonome qui nettoie les entrées contre les attaques par injection de sélecteur de requête :
app.use(mongoSanitize());

//supprimer les caractères "$" et "." dans les données fournies par l'utilisateur dans les endroits suivants:
// - req.body
// - req.params
// - req.headers
// - req.query

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limiter chaque ID à 100 tentatives
	standardHeaders: true, // Retourne rate limit info dans `RateLimit-*` headers
	legacyHeaders: false, // Désactive  `X-RateLimit-*` headers
});

//La limitation empêche la même adresse IP de faire trop de requests qui nous aideront à prévenir des attaques comme "force brute".
app.use(limiter);

//La ressource "images" est géré de manière statique dès qu'elle reçoit une requête vers la route /images.
//La méthode express.static : Pour servir des fichiers statiques tels que les images
//La méthode path.join() joint les segments de chemin spécifiés en un seul chemin.
app.use("/images", express.static(path.join(__dirname, "images")));

//enregistrement des routes
require("./routes/auth.routes")(app);
require("./routes/sauce.routes")(app);
// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers.
module.exports = app;
