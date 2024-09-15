const {getAllItems} = require('../models/itemsQuery')

async function get(req, res){
    try{
        const items = await getAllItems();
        res.json(items);
    }
    catch (error){
        console.error("Error fetching items:", error);
        res.status(500).send("Error fetching items");
    }
}

module.exports ={get}
