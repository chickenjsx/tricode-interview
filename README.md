# Expense Management System

A full-stack expense management application built with Express.js, React, and MySQL.

## Features

- **Create Expenses**: Users can submit expense reports with amount, description, and category
- **Role-based Access**: Different permissions for Users, Directors, and Executives
- **Expense Approval**: Directors and Executives can approve or deny pending expenses
- **Real-time Updates**: Frontend updates instantly when expenses are modified
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend

- **Express.js**: RESTful API server
- **Sequelize**: ORM for MySQL database operations
- **MySQL**: Database for storing users and expenses
- **Jest & Supertest**: Testing framework
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend

- **React**: Frontend framework
- **Vite**: Build tool and development server
- **CSS3**: Responsive styling

## Project Structure

```
tricode-interview/
├── server/                 # Backend API
│   ├── models/            # Sequelize models
│   │   ├── user.js        # User model
│   │   ├── expense.js     # Expense model
│   │   └── index.js       # Database connection
│   ├── tests/             # Jest test files
│   │   └── expense.test.js
│   ├── index.js           # Express server
│   ├── seed.js            # Database seeding script
│   ├── package.json
│   └── .env               # Environment variables
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── RoleSwitcher.jsx
│   │   ├── App.jsx        # Main App component
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── README.md
└── LICENSE
```

## Quick Start

### Prerequisites

- Node.js (v20+)
- MySQL server running on localhost:3300
- Database named 'interview' created

### 1. Setup Backend

```bash
cd server
npm install
npm run seed    # Create sample data
npm run dev     # Start development server on port 3001
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev     # Start development server on port 5173
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Expenses

- `GET /expenses` - Fetch all expenses
- `POST /expenses` - Create a new expense
- `PATCH /expenses/:id` - Approve/deny an expense (requires Director/Exec role)
- `DELETE /expenses/:id` - Delete an expense

### Example API Usage

**Create Expense:**

```javascript
POST /expenses
{
  "amount": 100.50,
  "description": "Office supplies",
  "category": "Office"
}
```

**Approve Expense:**

```javascript
PATCH /expenses/1
{
  "status": "approved",
  "userRole": "Director"
}
```

## User Roles

1. **User**: Can create and view expenses
2. **Director**: Can create, view, approve, and deny expenses
3. **Executive**: Can create, view, approve, and deny expenses

## Database Schema

### Users Table

- `id` (Primary Key)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `role` (Enum: 'User', 'Director', 'Exec')

### Expenses Table

- `id` (Primary Key)
- `amount` (Float, Required)
- `description` (String, Required)
- `category` (String, Required)
- `status` (Enum: 'pending', 'approved', 'denied')
- `userId` (Foreign Key to Users)

## Testing

Run backend tests:

```bash
cd server
npm test
```

Tests cover:

- Creating expenses
- Role-based approval/denial
- Error handling
- Database operations

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
DB_NAME=interview
DB_USER=chicken
DB_PASSWORD=chicken
DB_HOST=localhost
DB_PORT=3300
```

## Development

### Backend Development

```bash
cd server
npm run dev     # Auto-restart on changes
npm run test:watch  # Run tests on changes
```

### Frontend Development

```bash
cd client
npm run dev     # Hot reload enabled
```

## Building for Production

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
tricode.cloud interview
