const express = require("express");
const router  = express.Router();
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList}  = require("../controllers/user")
const {updateStock}  = require("../controllers/product")
const {getOrderById,createOrder,getAllOrders,getOrderStatus,updateStatus} = require("../controllers/order");

module.exports = router;

router.param("userId",getUserById);
router.param("orderId",getOrderById)

router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)


router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);
router.post("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);