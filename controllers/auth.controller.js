//Création d'un schéma avant de manipuler un objet
const userSchema = require("../schemas/user.schema");
// Importe le paquet bcrypt.
const bcrypt = require("bcrypt");
// Importe le jsonwebtoken.
const jsonWebToken = require("jsonwebtoken");
// hash le mot de passe 10 fois.
const saltRounds = 10;
// Récuperer la variable JWT_SECRETKEY du fichier de configuration.
const ENV_JWT_SECRETKEY = process.env.JWT_SECRETKEY;

//Importe le validator (vérification du format email).
const validator = require("validator");

// ------------------SIGNUP --------------------///

//Création de compte.
exports.signup = (req, res, next) => {
	let email = req.body.email;
	let password = req.body.password;

	// vérifier que le user est présent ou pas dans la bdd.
	if (email == null || email == "" || !validator.isEmail(email)) {
		return res.status(400).json({ message: "Veuillez renseigner l'email" });
	}
	// Cherche dans la base de donnée si le email est présent.
	userSchema
		.findOne({ email: email })
		.then((userExist) => {
			// Si l'utilsateur est trouver dans la base de données, un message est envoyé.
			if (userExist) {
				return res.status(400).json({ message: "email déjà présent" });
			} else {
				bcrypt.hash(password, saltRounds).then((hashedPassword) => {
					//si il n'est pas présent "l'utilisateur est crée dans dans la base de donnée et il est connect"
					const newuser = new userSchema({ email, password: hashedPassword });
					newuser
						.save()
						.then((newUser) => {
							res
								.status(201)
								.json({ message: "Utilisateur créé et sauvegardé !", newUser });
						})
						.catch((error) => res.status(400).send(error));
				});
			}
		})
		.catch((err) => res.status(400).send(err));
};

/// ------------------ LOGIN --------------------///

// connection au compte existant.
exports.login = (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	// Cherche dans la base de donnée si le email est présent.
	userSchema
		.findOne({ email: email })
		.then((user) => {
			console.log(user);
			//
			bcrypt.compare(password, user.password).then((passwordIsValid) => {
				//console.log(passwordIsValid);
				if (passwordIsValid) {
					const jsonWebTokenSign = jsonWebToken.sign(
						{
							email: email,
							user: user._id,
						},
						ENV_JWT_SECRETKEY,
						{ expiresIn: "24h" }
					);
					return res
						.status(200)
						.send({ userId: user._id, token: jsonWebTokenSign });
				} else {
					return res.status(401).send("password n'est pas correct");
				}
			});
		})
		.catch((err) =>
			res.status(400).send("le password ou l'email est incorrect", err)
		);
};
