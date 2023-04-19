const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

const getProfesseurById = async (requete, reponse, next) => {
  let professeurId = requete.params.professeurId;
  let unProf;

  try {
    unProf = await Professeur.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lorss la récupération du professeur.", 500)
    );
  }

  if (!unProf) {
    return next(
      new HttpErreur("Aucun professeur trouvée pour l'id fourni", 404)
    );
  }

  reponse.json({ professeur: unProf.toObject({ getters: true }) });
};

const ajouterProfesseur = async (requete, reponse, next) => {
  const { identifiant, nomEtPrenom, dateEmbauche } = requete.body;
  let unProfExiste;

  try {
    unProfExiste = await Professeur.findOne({ identifiant: identifiant });
  } catch {
    return next(new HttpErreur("Échec de vérification.", 500));
  }

  if (unProfExiste) {
    return next(new HttpErreur("Le professeur existe déjà!", 422));
  }

  let nouveauProfesseur = new Professeur({
    identifiant,
    nomEtPrenom,
    dateEmbauche,
    image: "../images/random.png",
    cours: [],
  });

  try {
    await nouveauProfesseur.save();
  } catch (err) {
    return next(new HttpErreur("Erreur lors de l'ajout du professeur.", 422));
  }

  reponse.status(200).json({ message: "Le professeur est ajouté !" });
};

const updateProfesseur = async (requete, reponse, next) => {
  const { nomEtPrenom, dateEmbauche, image } = requete.body;
  const professeurId = requete.params.professeurId;
  let unProf;

  try {
    unProf = await Professeur.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Échec lors de la récupération du professeur.", 500)
    );
  }

  if (!unProf) {
    return next(new HttpErreur("id du professeur non trouvé!", 404));
  }

  unProf.nomEtPrenom = nomEtPrenom;
  unProf.dateEmbauche = dateEmbauche;
  unProf.image = image;

  await unProf.save();

  reponse.status(200).json({ professeur: unProf.toObject({ getters: true }) });
};

const supprimerProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let unProf;

  // vérifier si le professeur existe
  try {
    unProf = await Professeur.findById(professeurId).populate("cours");
  } catch {
    return next(
      new HttpErreur("Échec lors de la récupération du professeur", 500)
    );
  }

  if (!unProf) {
    return next(new HttpErreur("Impossible de trouver le professeur"), 404);
  }

  try {

    // quand je supprime le prof, plus personne ne donne le cours, alors je supprime le cours.
    for (let i = 0; i < unProf.cours.length; i++) {
      unProf.cours[i].remove();
      await unProf.cours[i].save();
    }

    await unProf.remove();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur!", 500)
    );
  }

  reponse.status(200).json({ message: "Le professeur est supprimée" });
};

const supprimerCoursAuProfesseur = async (requete, reponse, next) => {};

exports.ajouterProfesseur = ajouterProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.updateProfesseur = updateProfesseur;
exports.supprimerProfesseur = supprimerProfesseur;
exports.supprimerCoursAuProfesseur = supprimerCoursAuProfesseur;
