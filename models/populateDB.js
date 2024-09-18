require('dotenv').config();
const { Client } = require("pg")

const queries = `
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                category_id INT REFERENCES categories(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                available_sizes TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS boys_clothes (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                material VARCHAR(255),
                color VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS girls_clothes (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                material VARCHAR(255),
                color VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS baby_gear (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                weight_capacity DECIMAL(5, 2),
                dimensions VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS feedings (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                type VARCHAR(255),
                age_range VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS diapers (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                size VARCHAR(255),
                pack_size INT
            );
            CREATE TABLE IF NOT EXISTS toys (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                category_id INT NOT NULL,
                material VARCHAR(255),
                age_range VARCHAR(255)
            );
        `;

async function populateDB() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        await client.query(queries);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables: ", error);
    } finally {
        await client.end();
    }
}

populateDB();