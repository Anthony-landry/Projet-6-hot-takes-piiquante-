// Appel du module externe jsonwebtoken.
const jsonwebtoken = require("jsonwebtoken");
// Récuperer la variable JWT_SECRETKEY du fichier de configuration.
const JWT_SECRETKEY = process.env.JWT_SECRETKEY;

module.exports = (req, res, next) => {
	try {
		// Récuperation du deuxieme élément du tableau "headers.authorization"
		const token = req.headers.authorization.split(" ")[1]; // Array
		const decodedToken = jsonwebtoken.verify(token, JWT_SECRETKEY);
		const userId = decodedToken.user;
		if (req.body.user && req.body.user !== userId) {
			res.status(403).json({
				error: new Error("403: unauthorized request"),
			});
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};
