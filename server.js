const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Cliente = require('./models/Cliente');
const Motivo = require('./models/Motivo');
const Solicitud = require('./models/Solicitud');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

app.post('/api/requests', async (req, res) => {
    try {
        const { name, email, phone, tipo, request } = req.body;

        if (!tipo) {
            return res.status(400).json({ success: false, message: 'Debes seleccionar un tipo de contacto' });
        }

        // Buscar o crear el cliente
        let cliente = await Cliente.findOne({ correo: email });
        if (!cliente) {
            cliente = await Cliente.create({ nombre: name, correo: email, telefono: phone });
        } else {
            cliente.nombre = name;
            cliente.telefono = phone;
            await cliente.save();
        }

        // Buscar o crear el motivo según lo que eligió el usuario
        let motivo = await Motivo.findOne({ nombre: tipo });
        if (!motivo) {
            motivo = await Motivo.create({ nombre: tipo, descripcion: 'Creado desde el formulario web' });
        }

        // Crear la solicitud
        const newSolicitud = await Solicitud.create({
            mensaje: request,
            cliente: cliente._id,
            motivo: motivo._id
        });

        res.status(201).json({ success: true, message: 'Solicitud guardada correctamente en MongoDB', data: newSolicitud });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});