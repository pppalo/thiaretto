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

// ── CREAR - Guardar formulario de contacto ──
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

// ── CONSULTAR - find() todas las solicitudes ──
app.get('/api/solicitudes', async (req, res) => {
    try {
        const solicitudes = await Solicitud.find()
            .populate('cliente')
            .populate('motivo');
        res.json({ success: true, data: solicitudes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── CONSULTAR - find() con filtro por fecha (últimos 7 días) ──
app.get('/api/solicitudes/recientes', async (req, res) => {
    try {
        const hace7dias = new Date();
        hace7dias.setDate(hace7dias.getDate() - 7);
        const solicitudes = await Solicitud.find({
            createdAt: { $gte: hace7dias }
        }).populate('cliente').populate('motivo');
        res.json({ success: true, data: solicitudes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── CONSULTAR - sort() clientes ordenados alfabéticamente ──
app.get('/api/clientes/ordenados', async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ nombre: 1 });
        res.json({ success: true, data: clientes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── CONSULTAR - aggregate() solicitudes agrupadas por tipo de motivo ──
app.get('/api/solicitudes/por-motivo', async (req, res) => {
    try {
        const resultado = await Solicitud.aggregate([
            {
                $lookup: {
                    from: 'motivos',
                    localField: 'motivo',
                    foreignField: '_id',
                    as: 'motivoInfo'
                }
            },
            { $unwind: '$motivoInfo' },
            {
                $group: {
                    _id: '$motivoInfo.nombre',
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
        res.json({ success: true, data: resultado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── ELIMINAR - cliente por id ──
app.delete('/api/clientes/:id', async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});