const express = require("express");

const controleursProfesseur = require("../controllers/professeurs-controleurs")
const router = express.Router();

router.get("/:professeurId", controleursProfesseur.getProfesseurById);

router.post('/', controleursProfesseur.ajouterProfesseur);

router.patch("/:professeurId", controleursProfesseur.updateProfesseur);

module.exports = router;
