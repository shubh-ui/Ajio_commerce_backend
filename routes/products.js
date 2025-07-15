const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/category/:categoryCode', productController.getProductsByCategory); 
router.get('/:id', productController.getProductById);
router.post('/:categoryCode', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
