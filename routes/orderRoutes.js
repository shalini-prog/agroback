const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const { getFarmerOrders } = require('../controllers/orderController'); // or orderController
const { createOrder } = require('../controllers/orderController');
const { getFarmerNotifications } = require('../controllers/orderController');
console.log("Testing controller import:", getFarmerOrders);

const { getCustomerOrders } = require('../controllers/orderController');
const {cancelOrderByCustomer,
  cancelOrderByFarmer,acceptOrder, completeOrder} = require('../controllers/orderController');

// View orders for farmer's products

router.get(
  '/farmer/orders',
  protect,
  roleProtect('farmer'),
  getFarmerOrders
);

router.get(
  '/farmer/notifications',
  protect,
  roleProtect('farmer'),
  getFarmerNotifications
);

router.get(
  '/customer/orders',
  protect,
  roleProtect('user'),
  getCustomerOrders
);


router.patch('/order/:orderId/cancel', protect, roleProtect('user'), cancelOrderByCustomer);

// Cancel order by farmer
router.patch('/order/:orderId/cancel-by-farmer', protect, roleProtect('farmer'), cancelOrderByFarmer);

router.put('/accept/:orderId', protect,roleProtect('farmer'), acceptOrder);

// Route to complete an order
router.put('/complete/:orderId', protect,roleProtect('farmer'), completeOrder);
router.post('/orders', protect, createOrder);

module.exports = router;
