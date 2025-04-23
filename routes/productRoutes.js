const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const { addProduct } = require('../controllers/productController');
const { updateProduct } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/productController');
// Create product (with image upload)
router.post(
    '/farmer/product',
    protect,
    roleProtect('farmer'),
    (req, res, next) => {
      upload.single('image')(req, res, function (err) {
        if (err) {
          return res.status(400).json({ message: err });
        }
        next();
      });
    },
    addProduct
  );
  
  module.exports = router;
 

router.put(
    '/farmer/product/:id',
    protect,
    roleProtect('farmer'),
    upload.single('image'), // optional new image
    updateProduct
  );
  

 

  router.delete(
    '/farmer/product/:id',
    protect,
    roleProtect('farmer'),
    deleteProduct
  );
  