const pool = require('./pool');

async function itemList() {
    const items = await pool.query('SELECT * FROM items');
    return items.rows;
}

async function findItem(id) {
    const item = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return item.rows[0];
}

async function categoryList() {
    const categories = await pool.query('SELECT * FROM categories');
    return categories.rows;
}

async function findCategory(id) {
    const itemCategory = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return itemCategory.rows[0];
}

async function deleteItem(id) {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
}

async function findCategoryByName(name) {
    const category = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    return category.rows;
}

async function countCategories() {
    const count = await pool.query('SELECT COUNT(*) FROM categories');
    return count;
}

async function countItems() {
    const count = await pool.query('SELECT COUNT(*) FROM items');
    return count;
}

async function findItemsByCategory(categoryId) {
    const items = await pool.query('SELECT * FROM items WHERE category_id = $1', [categoryId]);
    return items.rows;
}

async function createNewItem(name, description, price, numberInStock, categoryId) {
    await pool.query('INSERT INTO items (name, description, price, number_in_stock, category_id) VALUES ($1, $2, $3, $4, $5)', [name, description, price, numberInStock, categoryId]);
}

async function createNewCategory(categoryName, categoryDescription) {
    await pool.query('INSERT INTO categories (name, description) VALUES ($1, $2)', [categoryName, categoryDescription]);
}

async function deleteCategoryById(categoryId) {
    await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
}

async function updateCategory(categoryId, newCategoryName, newCategoryDescription) {
    await pool.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [newCategoryName, newCategoryDescription, categoryId]);
}

async function updateItem(name, description, price, numberInStock, categoryId, itemId) {
    await pool.query('UPDATE items SET name = $1, description = $2, price = $3, number_in_stock = $4, category_id = $5 WHERE id = $6', [name, description, price, numberInStock, categoryId, itemId]);
}
 
module.exports = { 
    itemList,
    findItem,
    categoryList,
    findCategory,
    deleteItem,
    findCategoryByName,
    countCategories,
    countItems,
    findItemsByCategory,
    createNewCategory,
    deleteCategoryById,
    updateCategory,
    createNewItem,
    updateItem
}