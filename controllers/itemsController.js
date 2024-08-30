const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const itemList = asyncHandler(async (req, res, next) => {
    const items = await db.itemList();

    res.render('itemList', {
        title: 'Item List',
        items: items,
    })
})

const itemDetails = asyncHandler(async (req, res, next) => {
    const item = await db.findItem(req.params.id);
    const itemCategory = await db.findCategory(item.category_id);

    res.render('itemDetails', {
        title: item.name,
        price: item.price,
        description: item.description,
        numberInStock: item.number_in_stock,
        category: itemCategory,
        itemId: item.id,
    })
})

const itemCreateGet = asyncHandler(async (req, res, next) => {
    const categories = await db.categoryList();
    res.render('itemForm', {
        title: 'Create New Item',
        categories: categories
    })
})

const validateNewItem = [
    body('category')
        .notEmpty()
        .isInt()
        .isLength({min: 1}),
    body('name')
        .trim()
        .isLength({min: 1}),
    body('description')
        .trim()
        .isLength({min: 1}),
    body('price')
        .notEmpty()
        .isFloat()
        .withMessage('Lowest price must be 0'),
    body('numberInStock')
        .notEmpty()
        .isInt({min: 0})
        .withMessage('Lowes number in stock must be 0'),
];

const itemCreatePost = [
    validateNewItem,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const categories = await db.categoryList();

        const itemCategoryId = req.body.category;

        const itemName =req.body.name;
        const itemDescription = req.body.description;
        const itemPrice = req.body.price;
        const itemStock = req.body.numberInStock;

        if(!errors.isEmpty()) {
            res.render('itemForm', {
                title: 'Create New Item',
                categories: categories,
                itemCategoryId: itemCategoryId,
                name: itemName,
                description: itemDescription,
                price: itemPrice,
                numberInStock: itemStock,
                errors: errors.array(),
            })
        } else {
            await db.createNewItem(itemName, itemDescription, itemPrice, itemStock, itemCategoryId);
            res.redirect('/items');
        }
    })
];

const itemDeleteGet = asyncHandler(async (req, res, next) => {
    const itemToDelete = await db.findItem(req.params.id);

    res.render('itemDelete', {
        name: itemToDelete.name
    })
})

const itemDeletePost = asyncHandler(async (req, res, next) => {
    await db.deleteItem(req.params.id);
    res.redirect('/items');
})

const itemUpdateGet = asyncHandler(async (req, res, next) => {
    const categories = await db.categoryList();
    const item = await db.findItem(req.params.id);
    const itemCategory = await db.findCategory(item.category_id);

    res.render('itemForm', {
        title: 'Update Item',
        categories: categories,
        itemCategoryId: itemCategory.id,
        name: item.name,
        description: item.description,
        price: item.price,
        numberInStock: item.number_in_stock,
    })
})

const validateItemUpdate = [
    body('category')
        .trim()
        .isLength({min: 1}),
    body('name')
        .trim()
        .isLength({min: 1}),
    body('description')
        .trim()
        .isLength({min: 1}),
    body('price')
        .notEmpty()
        .isFloat({min: 0})
        .withMessage('Lowest price must be 0'),
    body('numberInStock')
        .notEmpty()
        .isInt({min: 0})
        .withMessage('Lowes number in stock must be 0'),
];

const itemUpdatePost = [
    validateItemUpdate,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const categories = await db.categoryList();
        console.log(req.body)

        if(!errors.isEmpty()) {
            res.render('itemForm', {
                title: 'Update Item',
                categories: categories,
                itemCategoryId: req.body.category,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                numberInStock: req.body.numberInStock,
                errors: errors.array(),
            })
        } else {
            await db.updateItem(req.body.name, req.body.description, req.body.price, req.body.numberInStock, req.body.category, req.params.id);
            res.redirect('/items');
        }
    })
];

module.exports = {
    itemList,
    itemDetails,
    itemCreateGet,
    itemCreatePost,
    itemDeleteGet,
    itemDeletePost,
    itemUpdateGet,
    itemUpdatePost,
}