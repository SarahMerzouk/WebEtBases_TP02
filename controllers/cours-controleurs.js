const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");
const Etudiant = require("../models/etudiant");

const getCoursById = async (requete, reponse, next) => {
  let coursId = requete.params.coursId;
  let unCours;

  try {
    unCours = await Cours.findById(coursId);
  } catch (err) {
    return next(new HttpErreur("Erreur lorss la récupération du cours.", 500));
  }

  if (!unCours) {
    return next(new HttpErreur("Aucun cours trouvée pour l'id fourni", 404));
  }

  reponse.json({ professeur: unCours.toObject({ getters: true }) });
};

const ajouterCours = async (requete, reponse, next) => {
  const { titre, professeur, discipline, dateDebut, dateFin, session } =
    requete.body;
  let unCoursExiste;
  let unProf;

  // vérifier si le cours existe
  try {
    unCoursExiste = await Cours.findOne({ titre: titre });
  } catch {
    return next(new HttpErreur("Échec de la vérification du cours.", 500));
  }

  if (unCoursExiste) {
    return next(new HttpErreur("Le cours existe déjà!", 422));
  }

  // vérifier si le professeur existe
  try {
    unProf = await Professeur.findOne({ nomEtPrenom: professeur });
  } catch {
    return next(new HttpErreur("Échec de vérification du professeur.", 500));
  }

  if (!unProf) {
    return next(new HttpErreur("Le professeur n'existe pas!", 404));
  }

  let nouveauCours = new Cours({
    titre,
    professeur,
    discipline,
    nbMaxEtudiants: 0,
    dateDebut,
    dateFin,
    session,
    etudiants: [],
  });

  try {
    await nouveauCours.save();
    unProf.cours.push(nouveauCours);
    await unProf.save();
  } catch (err) {
    return next(new HttpErreur("Échec lors de l'ajout du cours.", 404));
  }

  reponse.status(201).json({ cours: nouveauCours.toObject({ getter: true }) });
};

const updateCours = async (requete, reponse, next) => {
  const { titre, discipline, nbMaxEtudiants, dateDebut, dateFin, session } =
    requete.body;
  const coursId = requete.params.coursId;
  let unCours;

  try {
    unCours = await Cours.findById(coursId);
  } catch (err) {
    return next(new HttpErreur("Échec lors de la récupération du cours.", 500));
  }

  if (!unCours) {
    return next(new HttpErreur("id du cours non trouvé!", 404));
  }

  unCours.titre = titre;
  unCours.discipline = discipline;
  unCours.nbMaxEtudiants = nbMaxEtudiants;
  unCours.dateDebut = dateDebut;
  unCours.dateFin = dateFin;
  unCours.session = session;

  await unCours.save();

  reponse.status(200).json({ cours: unCours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let unCours;
  let profQuiDonneCours;

  // vérifier si un cours existe
  try {
    unCours = await Cours.findById(coursId).populate("etudiants");
  } catch {
    return next(new HttpErreur("Échec lors de la récupération du cours", 500));
  }

  if (!unCours) {
    return next(new HttpErreur("Impossible de trouver le cours"), 404);
  }

  profQuiDonneCours = await Professeur.findOne({nomEtPrenom: unCours.professeur,});

  try {
    profQuiDonneCours.cours.pull(unCours);
    await profQuiDonneCours.save();

    for (let i = 0; i < unCours.etudiants.length; i++) {
      unCours.etudiants[i].cours.pull(unCours);
      await unCours.etudiants[i].save();
    }

    await unCours.remove();
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours"), 500);
  }

  reponse.status(200).json({ message: "Le cours est supprimée" });
};

exports.ajouterCours = ajouterCours;
exports.getCoursById = getCoursById;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;
