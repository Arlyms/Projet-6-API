const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // package création et verification de token 
const User = require('../models/User');

exports.signup = (req, res, next) => { // enregistrement de nouveau utilisateurs
    bcrypt.hash(req.body.password, 10) // hash = crypter le mot de passe 
        .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // 500 erreur server
};

exports.login = (req, res, next) => { // connecter des utilisateurs existants 
    User.findOne({ email: req.body.email }) // trouver un utilisateur 
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // compare = comparer le mot de pass avec le hash enregistré
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( 
              { userId: user._id},
              process.env.SECRET_KEY, 
              { expiresIn: '24h'} // expiration du token après 24h
            ) 
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
