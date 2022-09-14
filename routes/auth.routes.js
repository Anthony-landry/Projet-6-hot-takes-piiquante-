// Import du controller auth.
const authController = require("../controllers/auth.controller");
//Import du middleware password.
const passwordMiddleware = require("../middleware/password.middleware");

// requête

module.exports = (app) => {
	// Méthode http "post", puis le point d'accès
	app.post("/api/auth/signup", passwordMiddleware, authController.signup); //créer un compte
	// Méthode http "post", puis le point d'accès
	app.post("/api/auth/login", authController.login); //se connecter sur un compte déjà créé
};
