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



