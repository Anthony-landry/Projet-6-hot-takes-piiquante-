// Import du middleware jwt.
const jwtMiddleware = require("../middleware/jwt.middleware");
// Import du controller sauce.
const SauceController = require("../controllers/sauce.controller");
// Import du controller like dislike
const likeDislikeController = require("../controllers/like_dislike.controller");
// Import du middleware multer.
const multer = require("../middleware/multer.middleware");

// Ecouter le méthode GET et la route '/api/sauces'.
module.exports = (app) => {
	// Méthode http "get", puis le point d'accès,
	app.get("/api/sauces", jwtMiddleware, SauceController.getSauceList);
	// Méthode http "get", puis le point d'accès
	app.get("/api/sauces/:id", jwtMiddleware, SauceController.getSauceById);
	// Méthode http "post", puis le point d'accès
	app.post("/api/sauces", jwtMiddleware, multer, SauceController.createSauces);
	// Méthode http "put", puis le point d'accès
	app.put(
		"/api/sauces/:id",
		jwtMiddleware,
		multer,
		SauceController.modSauceById
	);
	// Méthode http "delete", puis le point d'accès
	app.delete("/api/sauces/:id", jwtMiddleware, SauceController.deleteSauceById);
	// Méthode http "post", puis le point d'accès
	app.post(
		"/api/sauces/:id/like",
		jwtMiddleware,
		likeDislikeController.likeUnlike
	);
};
