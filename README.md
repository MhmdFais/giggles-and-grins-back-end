# Giggles & Grins E-commerce Backend

This is the backend of the Giggles & Grins e-commerce project, a kid's accessories online store. It is built using Node.js and Express.js and interacts with a PostgreSQL database to handle various CRUD operations for product categories such as boys' clothes, girls' clothes, baby gear, diapers, feeding supplies, and toys.

### To Giggles & Grins front-end (Click Here)[https://github.com/MhmdFais/giggles-and-grins-front-end]

# Features

- Item Management: Add, update, delete, and retrieve items from different categories
- Category Management: Handle CRUD operations for various product categories
- API Routing: Separate routes for each category
- Cross-Origin Resource Sharing (CORS): Configured to handle cross-origin requests from the frontend


# Technologies Used

- Node JS
- Express JS
- PostgreSQL

# Project Setup

## Prerequisites

- Node JS
- PostgreSQL 

## Installation

1. Clone the repository

```
git clone https://github.com/your-username/giggles-grins-backend.git
cd giggles-grins-backend
```

2. Install dependencies

```
npm install
```

3. Setup PostgreSQL database

- Create a new PostgreSQL database

```
createdb ecom_db
```

- Create the tables by running migrations and seeds (assuming you're using Knex.js)

```
npx knex migrate:latest
npx knex seed:run
```

4. Create a .env file in the root directory

```
touch .env
```

Fill in the .env file with the following values

```
PORT=8080
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecom_db
```

5. Start the server

```
npm start
```

# Environment Variables

- PORT: The port on which the server will run (default is 8080)
- DB_HOST: PostgreSQL database host (default: localhost)
- DB_USER: PostgreSQL user
- DB_PASSWORD: PostgreSQL password
- DB_NAME: Name of the PostgreSQL database

# API Endpoints

| Method  | Endpoint                | Description                   |
|---------|-------------------------|-------------------------------|
| GET     | `/`                     | Get all items                 |
| GET     | `/boys`                 | Get all boys' clothes          |
| GET     | `/girls`                | Get all girls' clothes         |
| GET     | `/babygear`             | Get all baby gear              |
| GET     | `/diapers`              | Get all diapers                |
| GET     | `/feeding`              | Get all feeding items          |
| GET     | `/toys`                 | Get all toys                  |
| POST    | `/{category}`           | Add a new item to a category  |
| PUT     | `/{category}/{id}`      | Update an item by ID          |
| DELETE  | `/{category}/{id}`      | Delete an item by ID          |

# Data Base Schema




