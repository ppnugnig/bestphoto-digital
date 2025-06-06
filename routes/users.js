const express = require("express");
const router = express.Router();

//controller
const {
    listUsers,
    readUsers,
    updateUsers,
    removeUsers,
    changeStatus,
    changeRole,
    userCart,
    getUserCart,
    Address,
    saveOrder,
    emptyCart,
    userProfile,
    getOrders,
  } = require("../controllers/users");

// middleware
const { auth, adminCheck } = require("../middleware/auth");

//@Endpoint  http://localhost:5000/api/users
//@Method    GET
//@Access    Private
router.get("/users", auth, adminCheck, listUsers);


//@Endpoint  http://localhost:5000/api/users/:id
//@Method    GET
//@Access    Private
router.get("/users/:id", readUsers);

//@Endpoint  http://localhost:5000/api/users/:id
//@Method    PUT
//@Access    Private
router.put("/users/:id", auth, adminCheck, updateUsers);

//@Endpoint  http://localhost:5000/api/users/:id
//@Method    DELETE
//@Access    Private
router.delete("/users/:id", removeUsers);

//@Endpoint  http://localhost:5000/api/change-status
//@Method    POST
//@Access    Private
router.post("/change-status", auth, adminCheck, changeStatus);

//@Endpoint  http://localhost:5000/api/change-role
//@Method    POST
//@Access    Private
router.post("/change-role", auth, adminCheck, changeRole);

//@Endpoint  http://localhost:5000/api/users/cart  POST/GET
router.post("/user/cart", auth, userCart);
router.get("/user/cart", auth, getUserCart);
router.post("/user/address", auth, Address);
router.post("/user/order", auth, saveOrder);
router.get("/user/orders", auth, getOrders);
router.delete("/user/cart", auth, emptyCart);

router.get("/users/profile", auth, userProfile );




module.exports = router;