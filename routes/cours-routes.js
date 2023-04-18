const express = require("express");

const controleursCours = require("../controllers/cours-controleurs")
const router = express.Router();

router.get("/:coursId", controleursCours.getCoursById);

router.post('/', controleursCours.ajouterCours);

router.patch("/:coursId", controleursCours.updateCours);

module.exports = router;