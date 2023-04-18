const express = require("express");

const controleursEtudiant = require("../controllers/etudiants-controleurs");
const router = express.Router();

router.get("/:etudiantId", controleursEtudiant.getEtudiantById);

router.post('/', controleursEtudiant.ajouterEtudiant);

router.patch("/:etudiantId", controleursEtudiant.updateEtudiant);

module.exports = router;