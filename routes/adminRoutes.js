const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const roleProtect = require('../middleware/roleProtect');
const { getAllOrders ,deleteOrderByAdmin,deleteUser,getAllUsers} = require('../controllers/adminController');


router.get('/orders', protect, roleProtect('admin'), getAllOrders);

router.delete(
    '/orders/:orderId',
    protect,
    roleProtect('admin'),
    deleteOrderByAdmin
  );

  router.get('/users', protect, roleProtect('admin'), getAllUsers);
router.delete('/users/:userId', protect, roleProtect('admin'), deleteUser);



module.exports = router;
