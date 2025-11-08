# SmartCompare

A price comparison web application that helps users find the best deals across multiple e-commerce platforms.

## Features

- Product price comparison across multiple platforms
- User authentication (login/register)
- Real-time price tracking
- Responsive web interface
- Product search and filtering

## Tech Stack

**Frontend:**
- Next.js 14
- React
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Mr-KRAMA/SmartCompare.git
cd SmartCompare
```

### 2. Backend Setup
```bash
cd backend-js
npm install
```

Create `.env` file in `backend-js` directory:
```env
MONGODB_URI=mongodb://localhost:27017/smartcompare
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

Start the backend server:
```bash
npm start
```
Backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend development server:
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account or login with existing credentials
3. Search for products to compare prices
4. View price comparisons across different platforms

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get products
- `POST /api/products/search` - Search products

## Project Structure

```
SmartCompare/
├── frontend/          # Next.js frontend
├── backend-js/        # Node.js backend
├── backend/          # Python backend (alternative)
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.