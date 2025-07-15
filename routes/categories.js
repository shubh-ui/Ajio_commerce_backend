const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.get('/:categoryCode', categoryController.getCategoryByCode);
router.post('/', categoryController.createCategory);

module.exports = router;