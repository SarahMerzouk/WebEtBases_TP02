const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    professeur:{type:string, required: true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}] // tableau
});



module.exports = mongoose.model("Cours", coursSchema);