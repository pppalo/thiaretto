const mongoose = require('mongoose');

const motivoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String }
});

module.exports = mongoose.model('Motivo', motivoSchema);