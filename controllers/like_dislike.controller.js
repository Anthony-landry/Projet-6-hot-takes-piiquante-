// Importer le modèle des données sauces
const sauceSchema = require("../schemas/sauce.schema");

exports.likeUnlike = (req, res) => {
	const id = req.params.id;
	const userId = req.body.userId;
	const like = req.body.like;

	switch (like) {
		case -1:
			sauceSchema
				.findOneAndUpdate(
					// filtre avec id et non présence du user dans userDislike.
					{ _id: id, usersDisliked: { $nin: [userId] } },
					{ $push: { usersDisliked: userId } }
				)
				.then((sauce) => {
					return res.status(200).send({ message: "DisLike ajouté" });
				})
				.catch((err) => {
					return res.status(400).send({ message: err });
				});

			break;

		case 0:
			sauceSchema
				.findOneAndUpdate(
					// Si un like ou dislike est présent avec le userId qui est en paramètre, celui-ci est supprimé.
					{ _id: id, $or: [{ usersLiked: userId }, { usersDisliked: userId }] },
					{ $pull: { usersLiked: userId, usersDisliked: userId } }
				)
				.then((sauce) => {
					if (sauce) {
						console.log(sauce);
					}
				});
			return res
				.status(200)
				.send({ message: "mise à jour du statut like/ dislike" });

		case 1:
			sauceSchema
				.findOneAndUpdate(
					// filtre avec id et non présence du user dans userLlike.
					{ _id: id, usersLiked: { $nin: [userId] } },
					{ $push: { usersLiked: userId } }
				)
				.then((sauce) => {
					return res.status(200).send({ message: "Like ajouté" });
				})
				.catch((err) => {
					return res.status(400).send({ message: err });
				});
			break;
	}
};
