const router = require("express").Router();
const userController = require("../controllers/customerController");

// Get Routes
router.get("/", userController.user_get_index);
router.get("/user/add.html", userController.user_get_add); // in add_user.js
router.get("/search", userController.user_get_search);
router.get("/edit/:id", userController.user_get_edit);
router.get("/view/:id", userController.user_get_view);

// Delete Routes
router.delete("/edit/:id", userController.user_delete);

// Update Routes
router.put("/edit/:id", userController.user_update);

// Post Routes
router.post("/user/add.html", userController.user_post_add); // in add_user.js

// Search Routes
router.post("/search", userController.user_post_search);

module.exports = router;
