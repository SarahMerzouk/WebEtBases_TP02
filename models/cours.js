const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    professeur:{type:String, required: true, ref:"Professeur"},
    discipline: {type: String, required: true},
    nbMaxEtudiants: {type: Number, required: true},
    dateDebut: {type: String, required: true},
    dateFin: {type: String, required: true},
    session: {type: String, required: true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}] // tableau
});

module.exports = mongoose.model("Cours", coursSchema);