const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const index = asyncHandler(async (req, res, next) => {
    const categoryCount = await db.countCategories();
    const itemCount = await db.countItems();
    
    res.render('index', {
        title: 'Inventory Application',
        categoryCount: categoryCount.rowCount,
        itemCount: itemCount.rowCount
    })
})

const categoryList = asyncHandler(async (req, res, next) => {
    const categories = await db.categoryList();

    res.render('categoryList', {
        title: 'Category List',
        categories: categories,
    })
})

const categoryDetails = asyncHandler(async (req, res, next) => {
    const currentCategory = await db.findCategory(req.params.id);
    const categoryItems = await db.findItemsByCategory(currentCategory.id);

    res.render('categoryDetails', {
        title: currentCategory.name,
        categoryItems: categoryItems,
        description: currentCategory.description,
        categoryId:currentCategory.id
    })
})

const createCategoryGet = asyncHandler(async (req, res, next) => {
    res.render('categoryForm', {
        title: "Create New Category",
    })
})

const verifyNewCategory = [
    body('name')
        .trim()
        .isLength({min: 1}),
    body('description')
        .trim()
        .isLength({min: 1}),
];

const createCategoryPost = [
    verifyNewCategory,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const categoryName = req.body.name;
        const categoryDescription = req.body.description;

        if(!errors.isEmpty()) {
            res.render('categoryForm', {
                title: 'Create Category',
                name: categoryName,
                description: categoryDescription,
                errors: errors.array(),
            })
        } else {
            await db.createNewCategory(categoryName, categoryDescription);
            res.redirect('/categories');
        }
    })
]

const deleteCategoryGet = asyncHandler(async (req, res, next) => {
    const currentCategory = await db.findCategory(req.params.id);
    const categoryItems = await db.findItemsByCategory(currentCategory.id);

    res.render('categoryDelete', {
        categoryName: currentCategory.name,
        categoryItems: categoryItems,
    })
})

const deleteCategoryPost = asyncHandler(async (req, res, next) => {
    await db.deleteCategoryById(req.params.id);
    res.redirect('/categories');
})

const updateCategoryGet = asyncHandler(async (req, res, next) => {
    const categoryToUpdate = await db.findCategory(req.params.id);
    
    res.render('categoryForm', {
        title: 'Update Category',
        name: categoryToUpdate.name,
        description: categoryToUpdate.description,
    })
})

const verifyCategoryUpdate = [
    body('name')
        .trim()
        .isLength({min: 1}),
    body('description')
        .trim()
        .isLength({min: 1}),
];

const updateCategoryPost = [
    verifyCategoryUpdate,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('categoryForm', {
                title: 'Update Category',
                name: req.body.name,
                description: req.body.description,
                errors: errors.array(),
            })
        } else {
            await db.updateCategory(req.params.id, req.body.name, req.body.description);
            res.redirect('/categories');
        }
    })
]


module.exports = { 
    index, 
    categoryList, 
    categoryDetails, 
    createCategoryGet, 
    createCategoryPost, 
    deleteCategoryGet, 
    deleteCategoryPost, 
    updateCategoryGet,
    updateCategoryPost 
}