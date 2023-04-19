const express = require("express");

const controleursProfesseur = require("../controllers/professeurs-controleurs")
const router = express.Router();

router.get("/:professeurId", controleursProfesseur.getProfesseurById);

router.post('/', controleursProfesseur.ajouterProfesseur);

router.patch("/:professeurId", controleursProfesseur.updateProfesseur);

router.delete("/:professeurId", controleursProfesseur.supprimerProfesseur);

router.delete("/:professeurId", controleursProfesseur.supprimerCoursAuProfesseur);

module.exports = router;
