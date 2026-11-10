
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// API đăng nhập Admin
router.post("/login", async (req, res) => {
    try {
        const { email, matkhau } = req.body;

        if (!email || !matkhau) {
            return res.status(400).json({
                message: "Vui lòng nhập email và mật khẩu"
            });
        }

        // Kiểm tra email Admin
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không chính xác"
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(
            matkhau,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không chính xác"
            });
        }

        // Tạo JWT
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            admin: {
                email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
});

module.exports = router;
