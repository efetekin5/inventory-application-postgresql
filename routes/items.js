const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.itemList);

router.get('/:id', itemsController.itemDetails);

router.get('/item/create', itemsController.itemCreateGet);

router.post('/item/create', itemsController.itemCreatePost);

router.get('/:id/delete', itemsController.itemDeleteGet);

router.post('/:id/delete', itemsController.itemDeletePost);

router.get('/:id/update', itemsController.itemUpdateGet);

router.post('/:id/update', itemsController.itemUpdatePost);

module.exports = router;