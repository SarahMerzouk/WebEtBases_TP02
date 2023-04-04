const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

// me permet d'ajouter un professeur dans ma liste de profs s'il n'existe pas déjà
const ajouterProfesseur = async (requete, reponse, next) => {
    const {identifiant, nom, prenom} = requete.body;
    const nouveauProfesseur = new Professeur({
        identifiant,
        nom, 
        prenom,
        cours: []
    });

    // vérifier que le professeur existe, afficher un message d'erruer.
    let unProf;

    try {
        unProf = await Professeur.findById(identifiant);
    } catch {
        return next(new HttpErreur("Le professeur existe déjà!", 500));
    }

    // s'il n'existe pas, on l'ajoute à la liste
    if (!unProf) {
        try {
            await nouveauProfesseur.save();
        } catch(err) {
            return next(new HttpErreur("Ajout du professeur échoué.",500));
        }
    }

    reponse.status(201).json({professeur: nouveauProfesseur});
};
  