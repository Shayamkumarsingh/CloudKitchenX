# CloudKitchenX 🍅 — Multi-Service Food Delivery Platform

A full-stack, microservices-based food delivery platform built with React, Node.js, Express, MongoDB, Socket.io, and RabbitMQ. CloudKitchenX connects customers, restaurant partners, delivery riders, and admins through a seamless ordering experience with real-time order tracking and live rider location updates.

## Features

### Customer
- Browse restaurants and menus by location
- Add to cart, manage addresses, and checkout
- Razorpay payment integration
- Real-time order status tracking (Placed → Rider Assigned → Picked Up → Delivered)
- Live rider location tracking on map during delivery
- Order history (Active & Completed orders)

### Rider
- Profile registration (Aadhar, phone, driving license, photo upload)
- Verification workflow (Pending → Verified by admin)
- Online/offline availability toggle with geolocation
- Real-time incoming order requests via sockets
- Accept and manage current order
- Live location sharing with customer via Leaflet map and routing

### Restaurant (Seller)
- Restaurant profile and menu management
- Real-time incoming order notifications
- Order status updates

### Admin
- View and verify pending restaurants
- View and verify pending riders
- Role-based dashboard access

### Cross-Cutting
- JWT-based authentication across all services
- Role-based routing (customer / seller / rider / admin)
- Real-time updates via Socket.io (order updates, rider assignment, location)
- RabbitMQ for asynchronous order-ready events
- MongoDB Atlas as the shared database

## Architecture

The application is split into independent microservices:

| Service | Port | Responsibility |
|---|---|---|
| Auth Service | 5000 | User authentication & JWT issuance |
| Restaurant Service | 5001 | Restaurants, menus, orders |
| Utils Service | 5002 | File/image uploads (Cloudinary) |
| Realtime Service | 5004 | Socket.io server for live events |
| Rider Service | 5005 | Rider profiles, availability, order pickup |
| Admin Service | 5006 | Verification of restaurants & riders |
| Frontend | 5173 | React + Vite client |

All services connect to a shared MongoDB Atlas cluster (`cloudKitchenX` database).

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Axios, React Router, Leaflet (with Routing Machine), Socket.io-client, React Hot Toast
- **Backend:** Node.js, Express, TypeScript, Mongoose, MongoDB
- **Realtime:** Socket.io, JWT-authenticated socket connections
- **Messaging:** RabbitMQ
- **Payments:** Razorpay
- **File Storage:** Cloudinary
- **Maps:** OpenStreetMap via Leaflet + OSRM routing

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster
- RabbitMQ instance
- Cloudinary account
- Razorpay account
- Google OAuth credentials

### Environment Variables

Each backend service requires its own `.env` file. Example for the rider service:

```env
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/cloudKitchenX?appName=Cluster0
PORT=5005
JWT_SEC=your_jwt_secret
UTILS_SERVICE=http://localhost:5002
RESTAURANT_SERVICE=http://localhost:5001
INTERNAL_SERVICE_KEY=your_internal_key
```

> ⚠️ Ensure **all services** point to the **same database name** (`cloudKitchenX`) to avoid data mismatches between services.

### Installation

Clone the repository and install dependencies for each service:

```bash
# For each service (auth, restaurant, utils, realtime, rider, admin, frontend)
cd <service-folder>
npm install
```

### Running the Project

Start each backend service individually:

```bash
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Flow

1. **User signs up/logs in** via Google OAuth, selects a role (customer, rider, seller).
2. **Riders & restaurants** submit profiles for verification.
3. **Admin** reviews and verifies pending riders/restaurants.
4. **Customers** browse restaurants, place orders, and pay via Razorpay.
5. **Restaurant** accepts the order, triggering a real-time notification to nearby online riders.
6. **Rider** accepts the order, picks it up, and shares live location.
7. **Customer** tracks the order in real time on a live map until delivery.

## Known Considerations

- Riders must be **online** (`isAvailable: true`) and **verified** to receive order notifications.
- Socket rooms are auto-joined per user (`user:{userId}`) on connection — no manual join required.
- All `.env` database URIs across services must reference the same database name to keep collections in sync.

## License

This project is for educational/portfolio purposes.
