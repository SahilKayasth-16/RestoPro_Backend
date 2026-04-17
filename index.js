require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());
app.options("*", cors())

// Set socketio to app for use in controllers
app.set('socketio', io);

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes)

// Socket.io logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
