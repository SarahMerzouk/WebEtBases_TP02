const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const professeurSchema = new Schema({
    identifiant:{type:String, required:true},
    nom:{type: String, required: true},
    prenom:{type: String, required: true},
    dateEmbauche:{type: String, required:true},
    image:{type: String, required:true},
    cours: [{type: mongoose.Types.ObjectId, required: true, ref:"Cours"}] // tableau
});

module.exports = mongoose.model("Professeur", professeurSchema);