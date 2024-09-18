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
    const { name, price, quantity, available_sizes, description, category_id, image_url, categorySpecificFields } = updatedItemData;

    try {
        // items table
        const updateItemsQuery = `
            UPDATE items 
            SET 
                name = $1,
                price = $2,
                quantity = $3,
                available_sizes = $4,
                description = $5,
                category_id = $6,
                image_url = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
        `;

        await pool.query(updateItemsQuery, [
            name, 
            price, 
            quantity, 
            available_sizes, 
            description, 
            category_id, 
            image_url, 
            itemID
        ]);

        // category specific table
        const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}`; // 'boys_clothes', 'diapers'
        const categoryFields = categorySpecificFields.map((field, index) => `${field} = $${index + 2}`).join(', '); 

        const updateCategoryQuery = `
            UPDATE ${categoryTable} 
            SET ${categoryFields}
            WHERE item_id = $1
        `;

        const categoryValues = [itemID, ...Object.values(categorySpecificFields)];
        await pool.query(updateCategoryQuery, categoryValues);

        console.log(`Item with ID ${itemID} updated successfully in both tables.`);
        return { message: `Item with ID ${itemID} updated successfully.` };
    } catch (error) {
        console.error('Error updating item:', error);
        throw new Error('Error updating the item.');
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
    const client = await pool.connect();

    try {
        const {
            name,
            price,
            quantity,
            available_sizes,
            description,
            category_id,
            categorySpecificFields
        } = newItemData;

        const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}`;
        const fields = categoryFields[categoryTable];

        if (!fields) {
            throw new Error(`Category "${categoryName}" not found.`);
        }

        await client.query('BEGIN');

        const insertItemQuery = `
            INSERT INTO items (name, price, quantity, available_sizes, description, category_id, image_url, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
            RETURNING id
        `;

        const { rows } = await client.query(insertItemQuery, [
            name, price, quantity, available_sizes, description, category_id, image_url
        ]);

        const newItemId = rows[0].id;

        const insertCategoryQuery = `
            INSERT INTO ${categoryTable} (item_id, ${fields.join(', ')})
            VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(', ')})
        `;

        await client.query(insertCategoryQuery, [newItemId, ...Object.values(categorySpecificFields)]);

        await client.query('COMMIT');

        return { message: `Item added to category "${categoryName}" successfully`, itemId: newItemId };
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error('Error adding item:', error);
        throw new Error('Error adding item.');
    } finally {
        client.release();
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



