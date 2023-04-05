const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

// ça me permet d'accéder à un professeur selon le id.
const getProfesseurById = async(requete, reponse, next) => {
    let professeurId = requete.params.professeurId;
    let unProf;

    try {
        unProf = await Professeur.findById(professeurId);
    } catch (err) {
        return next(new HttpErreur("Erreur lorss la récupération du professeur.",500));
    }

    if (!unProf) {
        return next(new HttpErreur("Aucun professeur trouvée pour l'id fourni",404));
    }

    reponse.json({professeur: unProf.toObject({getters: true}) });
};

// me permet d'ajouter un professeur dans ma liste de profs s'il n'existe pas déjà
const ajouterProfesseur = async (requete, reponse, next) => {
    const {identifiant, nomEtPrenom, dateEmbauche} = requete.body;
    let unProfExiste;

    try {
        unProfExiste = await Professeur.findOne({identifiant: identifiant});
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
        cours: []
    });

    try {
        await nouveauProfesseur.save();
    } catch (err) {
        return next(new HttpErreur("Erreur lors de l'ajout du professeur.", 422));
    }

    reponse.status(201).json({professeur: nouveauProfesseur.toObject({getter : true}) });
};

// permet de mettre à jour les informations du professeur.
const updateProfesseur = async (requete, reponse, next) => {
    const {nomEtPrenom, dateEmbauche, image} = requete.body;
    const professeurId = requete.params.professeurId;
    let unProf;

    try {
        unProf = await Professeur.findById(professeurId);
    } catch(err) {
        return next(new HttpErreur("Échec lors de la récupération du professeur.",500));
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
  
  

exports.ajouterProfesseur = ajouterProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.updateProfesseur = updateProfesseur;