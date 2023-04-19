const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");
const Cours = require("../models/cours");

const getEtudiantById = async (requete, reponse, next) => {
  let etudiantId = requete.params.etudiantId;
  let unEtudiant;

  try {
    unEtudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors la récupération de l'étudiant.", 500)
    );
  }

  if (!unEtudiant) {
    return next(new HttpErreur("Aucun étudiant trouvé pour l'id fourni", 404));
  }

  reponse.json({ etudiant: unEtudiant.toObject({ getters: true }) });
};

const ajouterEtudiant = async (requete, reponse, next) => {
  const { nom, prenom, numero } = requete.body;
  let unEtudiant;

  try {
    unEtudiant = await Etudiant.findOne({ numero: numero });
  } catch {
    return next(new HttpErreur("Échec de vérification de l'étudiant.", 500));
  }

  if (unEtudiant) {
    return next(new HttpErreur("L'étudiant existe déjà!", 422));
  }

  let newStudent = new Etudiant({
    nom,
    prenom,
    numero,
    cours: [],
  });

  try {
    await newStudent.save();
  } catch (err) {
    return next(new HttpErreur("Erreur lors de l'ajout de l'étudiant.", 422));
  }

  reponse.status(201).json({ etudiant: newStudent.toObject({ getter: true }) });
};

const updateEtudiant = async (requete, reponse, next) => {
  const { nom, prenom } = requete.body;
  const etudiantId = requete.params.etudiantId;
  let unEtudiant;

  try {
    unEtudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Échec lors de la récupération de l'étudiant.", 500)
    );
  }

  if (!unEtudiant) {
    return next(new HttpErreur("id de l'étudiant non trouvé!", 404));
  }

  unEtudiant.nom = nom;
  unEtudiant.prenom = prenom;

  await unEtudiant.save();

  reponse
    .status(200)
    .json({ etudiant: unEtudiant.toObject({ getters: true }) });
};

const inscription = async (requete, reponse, next) => {
  const {numero, cours} = requete.body;
  let student;
  let leCoursPourInscription;

  // vérifier si l'élève existe
  try {
    student = await Etudiant.findOne({ numero: numero });
  } catch {
    return next(new HttpErreur("Échec de la vérification de l'étudiant.", 500));
  }

  if (!student) {
    return next(
      new HttpErreur(
        "Un étudiant qui n'existe pas ne peut pas s'inscrire à un cours.",
        404
      )
    );
  }

  // vérifier si le cours existe
  try {
    leCoursPourInscription = await Cours.findOne({ titre: cours });
  } catch {
    return next(new HttpErreur("Échec de la vérification du cours.", 500));
  }

  if (!leCoursPourInscription) {
    return next(new HttpErreur("Le cours n'existe pas.", 404));
  }

  // vérifier si l'étudiant est déjà inscrit
  const etudiantExiste = leCoursPourInscription.etudiants.find(id => id._id.toString() === student._id.toString());
  if (etudiantExiste) {
    return next(new HttpErreur("L'étudiant est déjà inscrit à ce cours", 422));
  }

  try {
    student.cours.push(leCoursPourInscription);
    await student.save();

    leCoursPourInscription.etudiants.push(student);
    await leCoursPourInscription.save();
  } catch {
    return next(
      new HttpErreur("Échec de l'inscription de l'étudiant au cours.", 422)
    );
  }
  reponse.status(201).json({ etudiant: student.toObject({ getter: true }) });
};

exports.ajouterEtudiant = ajouterEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
exports.inscription = inscription;
