const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");

// me permet d'ajouter un cours dans ma liste et un professeur doit lui être assigné
const ajouterCours = async (requete, reponse, next) => {
  const { titre, professeur, discipline, dateDebut, dateFin, session } = requete.body;
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
    unProf = await Professeur.findOne({ professeur: professeur });
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
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await nouveauCours.save({ session: sess });
    unProf.cours.push(nouveauCours);
    await unProf.save({ session: sess });

    await sess.commitTransaction();

  } catch (err) {
    return next(new HttpErreur("Échec lors de l'ajout du cours.",404));
  }

  reponse.status(201).json({ cours: nouveauCours.toObject({ getter: true }) });
};

exports.ajouterCours = ajouterCours;
