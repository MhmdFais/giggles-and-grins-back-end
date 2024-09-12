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
    const categoryTable = `${categoryName.toLowerCase().replace(/ /g, '_')}_clothes`; 
    const fields = categoryFields[categoryTable];  
    
    if (!fields) {
        throw new Error(`Category table "${categoryTable}" not found`);
    }

    const selectFields = fields.map(field => `c.${field}`).join(', ');

    const query = `
        SELECT i.id, i.name, i.price, i.quantity, i.available_sizes, i.image_url, ${selectFields}
        FROM items i
        JOIN ${categoryTable} c ON i.id = c.item_id
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



