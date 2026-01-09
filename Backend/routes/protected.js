const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    userId: req.user.id
  });
});

module.exports = router;
