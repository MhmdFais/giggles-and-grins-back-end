const { getItemsInACategory, deleteAnItem, editAnItem, getAllItems, getItemById, addItem } = require('../models/itemsQuery');

async function get(req, res) {
    try{
        const category = req.baseUrl.split('/')[1]
        const items = await getItemsInACategory(category)
        res.json(items)
    }
    catch (error){
        console.error("Error fetching items:", error)
        res.status(500).send("Error fetching items")
    }
}

async function viewAnItem(req, res) {
    try{
        const itemId = req.params.id
        const category = req.baseUrl.split('/')[1]
        const item = await getItemById(itemId, category)
        res.json(item)
    }
    catch(error){
        console.error("Error fetching item:", error)
        res.status(500).send("Error fetching item")
    }
}

async function deleteAnItemInCategory(req, res) {
    try{
        const itemId = req.params.id
        await deleteAnItem(itemId)
        res.json({ message: `Item with ID ${itemId} deleted successfully` })
    }
    catch(error){
        console.log("Error deleting the item: ", error)
        res.status(500).send("Error deleting item")
    }
}

async function editAnItemInCategory(req, res) {
    try {
        const itemId = req.params.id
        const category = req.params.category

        const itemData = await getItemById(itemId, category)

        if (!itemData) {
            return res.status(404).json({ message: 'Item not found' })
        }

        res.json({
            message: "Item fetched successfully",
            item: itemData
        })
    } catch (error) {
        console.error("Error fetching the item: ", error);
        res.status(500).send("Error fetching item for editing");
    }
}

async function enterEditedItem(req, res) {
    try {
        const itemId = req.params.id
        const category = req.baseUrl.split('/')[1] 
        const updatedItemData = req.body  

        await editAnItem(itemId, updatedItemData, category)
        res.json({ message: `Item with ID ${itemId} updated successfully` })
    } catch (error) {
        console.error("Error editing item:", error)
        res.status(500).json({ message: "Error editing item", error: error.message })
    }
}

async function addAnItem(req, res) {
    try {
        const newItemData = req.body  
        const category = req.baseUrl.split('/')[1] 

        await addItem(newItemData, category)
        res.status(201).json({ message: `Item added to ${category} successfully` })
    } catch (error) {
        console.error("Error adding item:", error)
        res.status(500).json({ message: "Error adding item", error: error.message })
    }
}

module.exports = {
    get,
    viewAnItem,
    deleteAnItemInCategory,
    editAnItemInCategory,
    enterEditedItem,
    addAnItem
};
