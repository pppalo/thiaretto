const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    mensaje: { type: String, required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    motivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Motivo', required: true },
    estado: { type: String, default: 'Pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', solicitudSchema);