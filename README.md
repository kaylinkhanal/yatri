# Yatri - Bus Management System

## Project Overview
Yatri is a comprehensive bus and vehicle management system designed to streamline bus operations, from route creation and fare assignment to real-time tracking and passenger reservations. The platform includes a dedicated admin panel, user-friendly dashboards for drivers and passengers, and a phased development roadmap to introduce new features.

## Releases & Features

### Version 1.0.0 - First Release (Major) ✅
- [x] Create Buses
- [x] Add/remove bus seat rows and columns dynamically, assign seat type
- [x] Create Stops
- [x] Create Routes
- [x] Assign fares
- [x] Reservation Module
- [x] Seat selection (female/disabled/child)
- [ ] Driver/sub-driver details
- [ ] Add round trips
- [ ] Vehicle current locations
- [x] Bus rental
- [x] ADMIN panel (inspired by [this design](https://dribbble.com/shots/13958896-Car-Rental-App))

### Version 1.0.1 - Second Release (Minor) 🚧
- [ ] Beverage booking
- [ ] Agent/travel tours
- [ ] Total trips (with offers)
- [ ] Driver/sub-driver rating
- [ ] Role-Based Access Control
- [ ] Differentiated dashboards for Drivers and Users
- [ ] Driver Profiles & Availability
- [ ] Drivers can update availability and vehicle info
- [ ] Drivers can receive ratings
- [ ] Ride Booking Flow
- [ ] Real-time ride requests
- [ ] Driver matching
- [ ] Trip tracking and completion
- [ ] Live Tracking & Socket Integration
- [ ] GeoJSON-powered driver location sync via Socket.IO
- [ ] Trip History & Receipt View
- [ ] Drivers and users can access ride summaries and digital receipts

### Phase 2 - Future Development 🎯
- [ ] Admins
- [ ] Admin Reporting Dashboard
- [ ] Visual metrics on rides, activity, and peak time usage
- [ ] OAuth integration (Google login)

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yatri.git
   cd yatri
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## Project Structure
```
yatri/
├── client/          # Next.js frontend
├── server/          # Express backend
└── README.md
```

## Contributing
We welcome contributions! Please feel free to submit issues and pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
