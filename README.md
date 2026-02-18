# BigBite3 - Food Delivery Platform

A full-stack food delivery application built with React, Node.js, Express, MongoDB, and Socket.IO for real-time order tracking.

## 🏗️ Project Structure

```
BigBite3/
│
├── backend/                          # Backend Server (Node.js + Express)
│   ├── config/
│   │   └── passport.js              # Passport.js authentication configuration
│   │
│   ├── middleware/
│   │   └── auth.js                  # Authentication middleware
│   │
│   ├── models/
│   │   ├── MenuItem.js              # Menu item schema
│   │   ├── Order.js                 # Order schema with status tracking
│   │   └── User.js                  # User schema (customer, restaurant, rider)
│   │
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── cart.js                  # Cart management routes
│   │   ├── order.js                 # Order CRUD and status updates
│   │   ├── restaurant.js            # Restaurant management routes
│   │   └── rider.js                 # Rider availability and management
│   │
│   ├── socket/
│   │   └── socketHandler.js         # Socket.IO event handlers
│   │
│   ├── utils/
│   │   └── auth.js                  # Auth utility functions
│   │
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore file
│   ├── fixOrderIndex.js             # Database index fix script
│   ├── package.json                 # Backend dependencies
│   ├── README.md                    # Backend documentation
│   ├── server.js                    # Main server file with Socket.IO
│   └── server_new.js                # Alternative server configuration
│
├── frontend/                         # Frontend Client (React + Vite)
│   ├── public/                      # Public assets
│   │
│   ├── src/
│   │   ├── assets/                  # Images, icons, static files
│   │   │
│   │   ├── components/              # React Components
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Hero.jsx             # Hero section
│   │   │   ├── KitchenDetailsModal.jsx  # Restaurant details modal
│   │   │   ├── LocationPicker.jsx   # Location selection component
│   │   │   ├── LoginModal.jsx       # Login modal
│   │   │   ├── MyOrders.jsx         # Customer order history
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── OrderTracking.jsx    # Real-time order tracking with map
│   │   │   ├── PartnerSection.jsx   # Partner/restaurant section
│   │   │   ├── Profile.jsx          # User profile management
│   │   │   ├── RestaurantDashboard.jsx  # Restaurant order management
│   │   │   ├── RestaurantExplore.jsx    # Browse restaurants
│   │   │   ├── RestaurantPage.jsx   # Individual restaurant page
│   │   │   ├── RestaurantRegistration.jsx  # Restaurant signup
│   │   │   ├── RiderDashboard.jsx   # Rider delivery management
│   │   │   ├── RiderProfile.jsx     # Rider profile settings
│   │   │   ├── SignupModal.jsx      # User signup modal
│   │   │   ├── tester.jsx           # Testing component
│   │   │   └── ViewCart.jsx         # Shopping cart
│   │   │
│   │   ├── context/                 # React Context API
│   │   │   ├── AppContext.jsx       # Global app state
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   │
│   │   ├── contexts/                # Additional contexts
│   │   │   └── SocketContext.jsx    # Socket.IO client context
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # API service functions
│   │   │
│   │   ├── App.css                  # Global styles
│   │   ├── App.jsx                  # Main App component
│   │   ├── index.css                # Base CSS
│   │   └── main.jsx                 # Entry point
│   │
│   ├── .env                         # Frontend environment variables
│   ├── .gitignore                   # Git ignore file
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── README.md                    # Frontend documentation
│   └── vite.config.js               # Vite configuration
│
├── ORDER_MANAGEMENT_COMPLETE.md     # Order management documentation
├── SETUP_GUIDE.md                   # Project setup guide
├── SOCKET_IMPLEMENTATION_SUMMARY.md # Socket.IO implementation details
└── SOCKET_SETUP_INSTRUCTIONS.md     # Socket setup instructions
```

## 🚀 Features

### Customer Features
- Browse restaurants by location
- View menu items with filters
- Add items to cart
- Place orders with delivery address
- Real-time order tracking with map
- Live order status updates
- Order history

### Restaurant Features
- Restaurant dashboard with 5 tabs (Pending, Accepted, Assigned, Delivered, Rejected)
- Menu management (add, edit, delete items)
- Accept/reject orders
- Update order status (preparing, ready, picked up)
- Real-time order notifications
- Kitchen availability toggle

### Rider Features
- Rider dashboard with 3 tabs (Available, Assigned, Completed)
- Location-based order notifications (25km radius)
- Accept delivery orders
- Update delivery status
- Real-time GPS location tracking
- Inline order details modal with map
- Availability restrictions (location permission required, cannot go unavailable with active orders)

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **Passport.js** - Authentication
- **JWT** - Token-based auth

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **React Leaflet** - Map integration
- **Tailwind CSS** - Styling

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with required variables
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with required variables
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env)
```
VITE_SERVER_URL=http://localhost:5000
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 🎯 Key Functionalities

### Real-Time Features
- Live order status updates via Socket.IO
- Restaurant receives instant order notifications
- Riders notified of nearby orders (Haversine distance calculation)
- Customer tracks order with live map
- Automatic order room management

### Order Flow
1. **Customer** places order → `pending` status
2. **Restaurant** accepts → `accepted` status → Notifies nearby riders
3. **Rider** accepts → `rider_assigned` status
4. Restaurant updates → `preparing` → `ready` → `picked_up`
5. Rider updates → `on_the_way`
6. Rider marks → `delivered`

### Order Status States
- `pending` - Waiting for restaurant
- `accepted` - Restaurant confirmed
- `rider_assigned` - Rider accepted delivery
- `preparing` - Food being prepared
- `ready` - Ready for pickup
- `picked_up` - Rider collected order
- `on_the_way` - En route to customer
- `delivered` - Successfully delivered
- `cancelled` / `rejected` / `auto_rejected` - Order cancelled

## 🗺️ Socket Architecture

### Socket Rooms
- `order_{orderId}` - All parties join for order-specific updates
- `restaurant_{restaurantId}` - Restaurant receives new orders
- `rider_{riderId}` - Individual rider notifications

### Socket Events
- `new_order_received` - Restaurant gets new order
- `order_status_changed` - Status updates to all parties
- `new_order_available` - Riders notified of nearby orders
- `order_taken` - Remove order from available pool
- `rider_location_update` - GPS tracking every 10 seconds

## 📱 Components Overview

### Customer Components
- `RestaurantExplore.jsx` - Browse restaurants
- `RestaurantPage.jsx` - Menu and ordering
- `ViewCart.jsx` - Cart management
- `OrderTracking.jsx` - Live tracking
- `MyOrders.jsx` - Order history

### Restaurant Components
- `RestaurantDashboard.jsx` - Order management dashboard
- `RestaurantRegistration.jsx` - Restaurant onboarding
- `KitchenDetailsModal.jsx` - Kitchen info

### Rider Components
- `RiderDashboard.jsx` - Delivery management
- `RiderProfile.jsx` - Rider settings

### Shared Components
- `Navbar.jsx` - Navigation
- `LoginModal.jsx` / `SignupModal.jsx` - Authentication
- `Profile.jsx` - User settings
- `LocationPicker.jsx` - Address selection

## 🔐 Authentication

- JWT-based authentication
- Role-based access (customer, restaurant, rider)
- Protected routes
- Session persistence
- Auth context for global state

## 📍 Location Features

- Haversine distance calculation (25km radius for riders)
- Real-time GPS tracking
- OpenStreetMap integration via Leaflet
- Custom map markers for restaurant, customer, rider
- Location permission management

## 🎨 UI/UX Features

- Responsive design
- Smooth animations (Framer Motion)
- Toast notifications (React Hot Toast)
- Loading states
- Optimistic UI updates
- Inline modals to preserve state
- Real-time status badges

## 📝 License

This project is private and proprietary.

## 👥 Contributors

- Bharat

## 🐛 Known Issues & Future Enhancements

- Implement payment gateway integration
- Add review and rating system
- Implement earnings tracking for riders
- Add push notifications
- Implement order analytics dashboard
- Add restaurant search and filters
- Multi-language support

---

Built with ❤️ using React, Node.js, and Socket.IO
