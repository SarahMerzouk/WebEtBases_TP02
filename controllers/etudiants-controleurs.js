const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");

const getEtudiantById = async (requete, reponse, next) => {};

const ajouterEtudiant = async (requete, reponse, next) => {
    const {nom, prenom, numero} = requete.body;
    let unEtudiant;

    try {
        unEtudiant = await Etudiant.findOne({numero: numero});
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
        cours: []
    });

    try {
        await newStudent.save();
    } catch (err) {
        return next(new HttpErreur("Erreur lors de l'ajout de l'étudiant.", 422));
    }

    reponse.status(201).json({etudiant: newStudent.toObject({getter : true}) });
};

const updateEtudiant = async (requete, reponse, next) => {};

exports.ajouterEtudiant = ajouterEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
