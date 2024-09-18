const pool = require('./pool')

const categoryFields = {
    boys_clothes: ['material', 'color'],
    girls_clothes: ['material', 'color'],
    diapers: ['size', 'pack_size'],
    baby_gear: ['weight_capacity', 'dimensions'],
    feedings: ['type', 'age_range'],
    toys: ['material', 'age_range']
};

async function getAllItems() {
    const {rows} = await pool.query("SELECT * FROM items")
    return rows
}

async function getItemsInACategory(categoryName) {
    const categoryResult = await pool.query("SELECT id FROM categories WHERE name = $1", [categoryName]);
    
    if (categoryResult.rows.length === 0) {
        throw new Error(`Category "${categoryName}" not found`);
    }
    
    const categoryId = categoryResult.rows[0].id;
    const fields = categoryFields[categoryName];  
    
    if (!fields) {
        throw new Error(`Category table "${categoryName}" not found`);
    }

    const selectFields = fields.map(field => `c.${field}`).join(', ');

    const query = `
        SELECT i.id, i.name, i.price, i.quantity, i.available_sizes, c.category_id, ${selectFields}
        FROM items i
        JOIN ${categoryName} c ON i.id = c.item_id
        WHERE i.category_id = $1
    `;

    const { rows } = await pool.query(query, [categoryId]);
    return rows;
}

async function deleteAnItem(itemID) {
    try {
        const query = 'DELETE FROM items WHERE id = $1';
        await pool.query(query, [itemID]);

        console.log(`Item with ID ${itemID} deleted successfully.`);
        return { message: `Item with ID ${itemID} deleted successfully.` };
    } catch (error) {
        console.error('Error deleting item:', error);
        throw new Error('Error deleting the item.');
    }
}

async function editAnItem(itemID, updatedItemData, categoryName) {
    const { name, price, quantity, available_sizes, description, category_id } = updatedItemData;

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Update items table
        const updateItemsQuery = `
            UPDATE items 
            SET 
                name = $1,
                price = $2,
                quantity = $3,
                available_sizes = $4,
                description = $5,
                category_id = $6,
                created_at = CURRENT_TIMESTAMP
            WHERE id = $7
        `;

        await pool.query(updateItemsQuery, [
            name, 
            price, 
            quantity, 
            available_sizes, 
            description, 
            category_id, 
            itemID
        ]);

        // Update category specific table
        const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}`;
        let updateCategoryQuery = '';
        let categoryValues = [];

        switch (categoryName) {
            case 'boys_clothes':
            case 'girls_clothes':
                updateCategoryQuery = `
                    UPDATE ${categoryTable} 
                    SET color = $2, material = $3
                    WHERE item_id = $1
                `;
                categoryValues = [itemID, updatedItemData.color, updatedItemData.material];
                break;
            case 'baby_gear':
                updateCategoryQuery = `
                    UPDATE ${categoryTable} 
                    SET weight_capacity = $2, dimensions = $3
                    WHERE item_id = $1
                `;
                categoryValues = [itemID, updatedItemData.weight_capacity, updatedItemData.dimensions];
                break;
            case 'feedings':
                updateCategoryQuery = `
                    UPDATE ${categoryTable} 
                    SET type = $2, age_range = $3
                    WHERE item_id = $1
                `;
                categoryValues = [itemID, updatedItemData.type, updatedItemData.age_range];
            case 'toys':
                updateCategoryQuery = `
                    UPDATE ${categoryTable} 
                    SET age_range = $2, material = $3
                    WHERE item_id = $1
                `;
                categoryValues = [itemID, updatedItemData.age_range, updatedItemData.material];
                break;
            case 'diapers':
                updateCategoryQuery = `
                    UPDATE ${categoryTable} 
                    SET size = $2, pack_size = $3
                    WHERE item_id = $1
                `;
                categoryValues = [itemID, updatedItemData.size, updatedItemData.pack_size];
                break;
            default:
                throw new Error(`Unknown category: ${categoryName}`);
        }

        console.log('Update category query:', updateCategoryQuery);
        console.log('Category values:', categoryValues);

        await pool.query(updateCategoryQuery, categoryValues);

        // Commit the transaction
        await pool.query('COMMIT');

        console.log(`Item with ID ${itemID} updated successfully in both tables.`);
        return { message: `Item with ID ${itemID} updated successfully.` };
    } catch (error) {
        // Rollback the transaction in case of error
        await pool.query('ROLLBACK');
        console.error('Error updating item:', error);
        throw error; // Throw the original error for better debugging
    }
}

async function getItemById(itemId, categoryName) {
    try {
        const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}`;
        const fields = categoryFields[categoryTable];

        if (!fields) {
            throw new Error(`Category "${categoryName}" not found`);
        }

        const selectFields = fields.map(field => `c.${field}`).join(', ');

        const query = `
            SELECT i.id, i.name, i.price, i.quantity, i.available_sizes, i.description, ${selectFields}
            FROM items i
            JOIN ${categoryTable} c ON i.id = c.item_id
            WHERE i.id = $1
        `;

        const { rows } = await pool.query(query, [itemId]);
        if (rows.length === 0) {
            throw new Error(`Item with ID ${itemId} not found in category "${categoryName}".`);
        }

        return rows[0];
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw new Error('Error fetching item by ID.');
    }
}

async function addItem(newItemData, categoryName) {
    const {
        name,
        price,
        quantity,
        available_sizes,
        description,
        category_id
    } = newItemData;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        // Insert into `items` table
        const insertItemQuery = `
            INSERT INTO items (name, price, quantity, available_sizes, description, category_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING id
        `;

        const { rows } = await client.query(insertItemQuery, [
            name,
            price,
            quantity,
            available_sizes,
            description,
            category_id
        ]);

        const newItemId = rows[0].id; // Retrieve the new item ID

        // Prepare to insert into category-specific table
        const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}`;
        let insertCategoryQuery = '';
        let categoryValues = [];

        switch (categoryName) {
            case 'boys_clothes':
            case 'girls_clothes':
                insertCategoryQuery = `
                    INSERT INTO ${categoryTable} (item_id, color, material)
                    VALUES ($1, $2, $3)
                `;
                categoryValues = [newItemId, newItemData.color, newItemData.material];
                break;
            case 'baby_gear':
                insertCategoryQuery = `
                    INSERT INTO ${categoryTable} (item_id, weight_capacity, dimensions)
                    VALUES ($1, $2, $3)
                `;
                categoryValues = [newItemId, newItemData.weight_capacity, newItemData.dimensions];
                break;
            case 'feedings':
                insertCategoryQuery = `
                    INSERT INTO ${categoryTable} (item_id, type, age_range)
                    VALUES ($1, $2, $3)
                `;
                categoryValues = [newItemId, newItemData.type, newItemData.age_range];
                break;
            case 'toys':
                insertCategoryQuery = `
                    INSERT INTO ${categoryTable} (item_id, age_range, material)
                    VALUES ($1, $2, $3)
                `;
                categoryValues = [newItemId, newItemData.age_range, newItemData.material];
                break;
            case 'diapers':
                insertCategoryQuery = `
                    INSERT INTO ${categoryTable} (item_id, size, pack_size)
                    VALUES ($1, $2, $3)
                `;
                categoryValues = [newItemId, categorySpecificFields.size, categorySpecificFields.pack_size];
                break;
            default:
                throw new Error(`Unknown category: ${categoryName}`);
        }

        // Execute category-specific insert query
        await client.query(insertCategoryQuery, categoryValues);

        // Commit transaction
        await client.query('COMMIT');

        console.log(`New item added to category "${categoryName}" with ID ${newItemId}.`);
        return { message: `Item added to category "${categoryName}" successfully`, itemId: newItemId };
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error adding item:', error);
        throw new Error('Error adding item.');
    } finally {
        client.release(); // Release the client back to the pool
    }
}




module.exports = {
    deleteAnItem,
    getAllItems,
    getItemsInACategory,
    editAnItem,
    getItemById,
    addItem
}



