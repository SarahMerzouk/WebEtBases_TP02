const express = require("express");

const controleursProfesseur = require("../controllers/professeurs-controleurs")
const router = express.Router();

router.post('/', controleursProfesseur.ajouterProfesseur);

module.exports = router;
