const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar modelos traducidos
const Cliente = require('./models/Cliente');
const Motivo = require('./models/Motivo');
const Solicitud = require('./models/Solicitud');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Servir archivos estáticos del frontend

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/thiarettoDB')
    .then(async () => {
        console.log('✅ Conectado a MongoDB local');
        
        // Crear un motivo por defecto si no existe
        let defaultMotivo = await Motivo.findOne({ nombre: 'Contacto General' });
        if (!defaultMotivo) {
            defaultMotivo = await Motivo.create({ nombre: 'Contacto General', descripcion: 'Mensajes enviados desde el formulario web' });
        }
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Ruta principal para procesar el formulario
app.post('/api/requests', async (req, res) => {
    try {
        const { name, email, phone, request } = req.body;

        // 1. Buscar si el cliente ya existe por su correo, si no, lo creamos
        let cliente = await Cliente.findOne({ correo: email });
        if (!cliente) {
            cliente = await Cliente.create({ nombre: name, correo: email, telefono: phone });
        } else {
            // Actualizar datos si es que cambiaron (ej: teléfono nuevo)
            cliente.nombre = name;
            cliente.telefono = phone;
            await cliente.save();
        }

        // 2. Obtener el motivo por defecto
        const motivo = await Motivo.findOne({ nombre: 'Contacto General' });

        // 3. Crear la solicitud referenciando a Cliente y Motivo
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

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});