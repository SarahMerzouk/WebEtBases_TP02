const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

// ça me permet d'accéder à un professeur selon le id.
const getProfesseurById = async(requete, reponse, next) => {
    let professeurId = requete.params.professeurId;
    let unProf;

    // vérifier si le prof existe
    try {
        unProf = await Professeur.findById(professeurId);
    } catch (err) {
        return next(new HttpErreur("Erreur lorss la récupération du professeur.",500));
    }

    // s'il n'existe pas, j'affiche un message d'erreur.
    if (!unProf) {
        return next(new HttpErreur("Aucun professeur trouvée pour l'id fourni",404));
    }

    reponse.json({professeur: unProf.toObject({getters: true}) });
};

// me permet d'ajouter un professeur dans ma liste de profs s'il n'existe pas déjà
const ajouterProfesseur = async (requete, reponse, next) => {
    const {identifiant, nom, prenom} = requete.body;

    // vérifier si le prof existe déjà
    let unProfExiste;

    try {
        unProfExiste = await Professeur.findOne({identifiant: identifiant});
    } catch {
        return next(new HttpErreur("Échec de vérification.", 500));
    }

    // si le prof existe, on affiche un message d'erreur.
    if (unProfExiste) {
        return next(new HttpErreur("Le professeur existe déjà!", 422));
    }

    // s'il n'existe pas, on le crée et on l'ajoute
    let nouveauProfesseur = new Professeur({
        identifiant,
        nom, 
        prenom,
        cours: []
    });

    try {
        await nouveauProfesseur.save();
    } catch (err) {
        return next(new HttpErreur("Erreur lors de l'ajout du professeur.", 422));
    }

    reponse.status(201).json({professeur: nouveauProfesseur.toObject({getter : true}) });
};

exports.ajouterProfesseur = ajouterProfesseur;
exports.getProfesseurById = getProfesseurById;