const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');

router.post('/', sauceCtrl.createSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);

module.exports = router;