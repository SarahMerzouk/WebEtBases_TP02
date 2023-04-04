const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

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