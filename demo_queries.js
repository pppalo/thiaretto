const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');
const Motivo = require('./models/Motivo');
const Solicitud = require('./models/Solicitud');

async function runDemo() {
    try {
        console.log("=== INICIANDO DEMOSTRACIÓN DE CONSULTAS MONGODB (RÚBRICA) ===\n");
        await mongoose.connect('mongodb://127.0.0.1:27017/thiarettoDB');
        console.log("✅ Conectado a MongoDB");

        // 1. CREAR (C) - Preparando datos de prueba
        console.log("\n--- OPERACIÓN CREAR ---");
        const motivo1 = await Motivo.create({ name: 'Soporte Técnico', description: 'Problemas técnicos' });
        const motivo2 = await Motivo.create({ name: 'Ventas', description: 'Consultas de precios' });
        
        const cliente1 = await Cliente.create({ name: 'Juan Perez', email: 'juan@test.com', phone: '12345678' });
        const cliente2 = await Cliente.create({ name: 'Maria Gomez', email: 'maria@test.com', phone: '87654321' });

        await Solicitud.create([
            { message: 'Mi computadora no enciende.', cliente: cliente1._id, motivo: motivo1._id, status: 'Pendiente' },
            { message: 'Quiero cotizar una página web.', cliente: cliente2._id, motivo: motivo2._id, status: 'Resuelto' },
            { message: 'Ayuda con el sistema de ventas.', cliente: cliente1._id, motivo: motivo1._id, status: 'Pendiente' }
        ]);
        console.log("✅ Datos de prueba creados en MongoDB (Clientes, Motivos, Solicitudes)");

        // 2. CONSULTAR (R) - find()
        console.log("\n--- CONSULTA: find() ---");
        const allSolicitudes = await Solicitud.find().populate('cliente').populate('motivo');
        console.log(`Se encontraron ${allSolicitudes.length} solicitudes en total.`);
        
        // 3. CONSULTA CON FILTROS DE COMPARACIÓN
        console.log("\n--- CONSULTA CON FILTROS (Operador de comparación) ---");
        // Usamos $eq y $gte
        const pendingSolicitudes = await Solicitud.find({ 
            status: { $eq: 'Pendiente' },
            createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } // Creadas en las últimas 24 horas
        });
        console.log(`Se encontraron ${pendingSolicitudes.length} solicitudes pendientes recientes usando $eq y $gte.`);

        // 4. CONSULTA ORDENADA - sort()
        console.log("\n--- CONSULTA ORDENADA: sort() ---");
        const sortedSolicitudes = await Solicitud.find().sort({ createdAt: -1 }).limit(2);
        console.log(`Las 2 solicitudes más recientes ordenadas descendentemente:`);
        sortedSolicitudes.forEach(r => console.log(` - [${r.createdAt.toISOString()}] ${r.message}`));

        // 5. ACTUALIZAR (U)
        console.log("\n--- OPERACIÓN ACTUALIZAR ---");
        const updateResult = await Solicitud.updateOne(
            { message: 'Mi computadora no enciende.' },
            { $set: { status: 'Resuelto' } }
        );
        console.log(`✅ Documentos actualizados: ${updateResult.modifiedCount}`);

        // 6. ELIMINAR (D)
        console.log("\n--- OPERACIÓN ELIMINAR ---");
        const deleteResult = await Solicitud.deleteOne({ message: 'Ayuda con el sistema de ventas.' });
        console.log(`✅ Documentos eliminados: ${deleteResult.deletedCount}`);

        // 7. CONSULTA AGGREGATE - aggregate()
        console.log("\n--- CONSULTA AGGREGATE ---");
        // Contar cuantas solicitudes hay por cada estado
        const aggregateResult = await Solicitud.aggregate([
            { $group: { _id: "$status", total: { $sum: 1 } } }
        ]);
        console.log("Resumen de Solicitudes por Estado:");
        console.log(aggregateResult);

    } catch (error) {
        console.error("❌ Error en la demostración:", error);
    } finally {
        await mongoose.connection.dropDatabase(); // Limpiamos para poder correrlo muchas veces
        await mongoose.disconnect();
        console.log("\n✅ Demostración finalizada y conexión cerrada.");
    }
}

runDemo();
