# thiaretto 🫧

Página web de portafolio grupal desarrollada por **Javiera**, **Benjamín** y **Paloma**, tres estudiantes apasionados por la programación y la resolución de problemas tecnológicos.

## 🌐 Demo en vivo

[https://thiaretto-production.up.railway.app](https://thiaretto-production.up.railway.app)

## 👥 Equipo

| Integrante | Rol |
|---|---|
| Javiera | Desarrollo Frontend & Diseño |
| Benjamín | Desarrollo de Juego & Lógica |
| Paloma | Backend & Base de Datos |

## 📋 Descripción

**thiaretto** es un portafolio grupal interactivo que presenta a nuestro equipo y nuestras habilidades en desarrollo web. Incluye:

- 🎮 **BAD BENJAMIN** — Minijuego original desarrollado completamente en JavaScript con múltiples niveles, personajes con skins, música y efectos de sonido
- 📬 **Formulario de contacto** conectado a una base de datos real en MongoDB
- 🌙 **Modo oscuro/claro** con preferencia guardada
- 📱 **Diseño responsive** adaptado para móviles y escritorio

## 🛠️ Tecnologías utilizadas

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB + Mongoose
- **Control de versiones:** Git + GitHub
- **Despliegue:** Railway + MongoDB Atlas

## 🚀 Cómo ejecutar localmente

1. Clona el repositorio:
```bash
git clone https://github.com/pppalo/thiaretto.git
```

2. Instala las dependencias:
```bash
cd thiaretto
npm install
```

3. Crea un archivo `.env` con tu cadena de conexión a MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/thiarettoDB
```

4. Inicia el servidor:
```bash
node server.js
```

5. Abre `http://localhost:3000` en tu navegador.

## 📁 Estructura del proyecto

```
thiaretto/
├── Assets/          # Sprites, música y recursos multimedia
├── models/          # Modelos de MongoDB (Cliente, Motivo, Solicitud)
├── index.html       # Página principal
├── style.css        # Estilos globales
├── main.js          # Lógica del frontend
├── game.js          # Motor del minijuego
└── server.js        # Servidor Node.js + API REST
```

## ✉️ Contacto

¿Tienes un proyecto en mente? ¡Escríbenos a través del formulario en nuestra página!

---

&copy; 2026 BenjamínG, PalomaCH, JavieraZ.
