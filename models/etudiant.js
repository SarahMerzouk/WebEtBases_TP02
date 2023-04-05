const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    nom:{type: String, required: true},
    prenom:{type: String, required: true},
    numero: {type: String, required: true},
    cours: [{type: mongoose.Types.ObjectId, required: true, ref:"Cours"}] // tableau
});

module.exports = mongoose.model("Etudiant", etudiantSchema);