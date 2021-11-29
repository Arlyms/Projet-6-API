var passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum length 8
.is().max(50)                                  // Maximum length 50
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces

module.exports = (req, res, next) => {
    if(schema.validate(req.body.password)){
        return next();
    } else {
        return res.status(400).json({error: "mot de passe invalide !" })
    }
};