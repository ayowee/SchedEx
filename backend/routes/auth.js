// backend/routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Login Route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: err.message });
            return res.status(200).json({ message: "Login successful", user });
        });
    })(req, res, next);
});

// Google OAuth Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("http://localhost:3000/dashboard"); // Redirect to frontend dashboard
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "Logout successful" });
    });
});

module.exports = router;