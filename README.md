# Enquiry Node

A Node.js Express application for managing user authentication, subjects, and packages with role-based access control.

## Project Structure

```
enquiry_node/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── database.js        # Database configuration
│   │   └── jwt.js             # JWT configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   └── user.controller.js # User management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js # JWT authentication
│   │   └── role.middleware.js # Role-based access control
│   ├── models/
│   │   ├── index.js           # Model initialization
│   │   ├── user.js            # User model
│   │   ├── subject.js         # Subject model
│   │   └── package.js         # Package model
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   └── user.routes.js     # User routes
│   ├── utils/
│   │   ├── password.js        # Password hashing utilities
│   │   └── response.js        # Response formatting
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enquiry_node
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=enquiry_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Run migrations:
```bash
npx sequelize-cli db:migrate
```

5. Seed the database (optional):
```bash
npx sequelize-cli db:seed:all
```

## Running the Application

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user

### User Routes (`/api/users`)
- `POST /` - Create a new user (Admin only)
- `POST /change-password` - Change password (Admin only)

**Authentication:** All user routes require a valid JWT token in the `Authorization` header.

## Models

### User
- `id` - Primary key
- `email` - User email
- `password` - Hashed password
- `role` - User role (ADMIN, USER)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Subject
- `id` - Primary key
- `name` - Subject name
- `code` - Subject code
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Package
- `id` - Primary key
- `name` - Package name
- `code` - Package code
- `subjectId` - Foreign key to Subject
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Database Migrations

Run migrations:
```bash
npx sequelize-cli db:migrate
```

Undo last migration:
```bash
npx sequelize-cli db:migrate:undo
```

Create a new migration:
```bash
npx sequelize-cli migration:generate --name migration-name
```

## Dependencies

- **express** - Web framework
- **sequelize** - ORM
- **mysql2** - MySQL driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variable management

## License

MIT
