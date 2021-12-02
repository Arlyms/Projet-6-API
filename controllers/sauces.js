const Sauce = require("../models/Sauce");
const fs = require("fs");

// Create a sauce 
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then((saucesFromBdd) => res.status(200).json({ sauces: saucesFromBdd }))
    .catch((error) => res.status(404).json({ error }));
};

// Display all sauce 
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      console.log(sauce);
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(400).json({ error }));
};

// Display one sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Modify the sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Delete the sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Like / Dislike the sauce
exports.likeDislikeSauce = (req, res, next) => {
  const { like, userId } = req.body;
  const { id } = req.params;

  console.log(req.body);
  Sauce.findOne({ _id: id })
    .then((sauce) => {
      //User likes the sauce
      if (like == 1) {
        sauce.usersLiked.push(userId);
        sauce.likes += 1;

        removeFromDislikes(userId, sauce);

        sauce
          .save()
          .then(() => {
            res.status(200).json();
          })
          .catch((error) => res.status(500).json({ error }));

        //User dislike the sauce
      } else if (like == -1) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes += 1;

        removeFromLikes(userId, sauce);

        sauce
          .save()
          .then(() => {
            res.status(200).json();
          })
          .catch((error) => res.status(500).json({ error }));
      }
      //User is neutral
      else if (like == 0) {
        //Removes user from usersliked
        removeFromLikes(userId, sauce);

        //Removes user from usersdisliked
        removeFromDislikes(userId, sauce);

        sauce
          .save()
          .then(() => {
            res.status(200).json();
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

function removeFromLikes(userId, sauce) {
  let index = sauce.usersLiked.indexOf(userId);
  if (index !== -1) {
    sauce.usersLiked.splice(index, 1);
    sauce.likes -= 1;
  }
}

function removeFromDislikes(userId, sauce) {
  index = sauce.usersDisliked.indexOf(userId);
  if (index !== -1) {
    sauce.usersDisliked.splice(index, 1);
    sauce.dislikes -= 1;
  }
}
