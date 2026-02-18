import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from './config/passport.js';
import { configurePassport } from './config/passport.js';
// Import routes
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurant.js';
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";

// Load env vars
dotenv.config();
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// app.use(cors())

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
configurePassport();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // User authentication - join room based on user ID
  socket.on('authenticate', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} authenticated and joined room`);
  });
  
  // Rider authentication - join rider room
  socket.on('rider_authenticate', (riderId) => {
    socket.join(`rider_${riderId}`);
    console.log(`Rider ${riderId} authenticated and joined room`);
  });
  
  // Rider location update
  socket.on('rider_location_update', ({ orderId, location }) => {
    // Broadcast location to customer tracking this order
    io.to(`order_${orderId}`).emit('rider_location', location);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}); 

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Socket.IO enabled`);
});
