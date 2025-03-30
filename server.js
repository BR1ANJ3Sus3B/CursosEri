require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cursosEriDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto',
    resave: false,
    saveUninitialized: false
}));

// Ruta para servir la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para manejar el registro de usuarios
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }

        // Hashear la contraseña y guardar al usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        console.log(`✅ Nuevo usuario registrado: ${email}`);
        res.redirect('/login');
    } catch (err) {
        console.error('❌ Error al registrar usuario:', err);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            req.session.userId = user._id;
            console.log(`✅ Usuario autenticado: ${email}`);
            res.redirect('/course'); // Redirige al curso
        } else {
            res.status(401).send('Contraseña incorrecta');
        }
    } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta protegida (Curso de Maquillaje)
app.get('/course', (req, res) => {
    if (!req.session.userId) return res.redirect('/login'); // Verifica si está autenticado
    res.sendFile(path.join(__dirname, 'public', 'Cursos.html')); // Muestra el curso
});

app.get('/form', (req, res) => {
    if (!req.session.userId) return res.redirect('/couser'); // Verifica si está autenticado
    res.sendFile(path.join(__dirname, 'public', 'Form.html')); // Muestra el curso
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
