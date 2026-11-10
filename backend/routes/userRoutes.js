
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// API lấy danh sách người dùng
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-matkhau");

        res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
});


// API thêm người dùng
router.post("/", async (req, res) => {
    try {
        const { email, matkhau, hoten, hinhanh } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!email?.trim() || !matkhau || !hoten?.trim()) {
            return res.status(400).json({
                message: "Vui lòng nhập email, mật khẩu và họ tên"
            });
        }

        // Kiểm tra kích thước ảnh
        if (hinhanh && hinhanh.length > 8 * 1024 * 1024) {
            return res.status(413).json({
                message: "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn."
            });
        }

        // Kiểm tra email tồn tại
        const existingUser = await User.findOne({
            email: email.trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email đã tồn tại"
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(matkhau, 10);

        // Tạo người dùng
        const newUser = new User({
            email: email.trim(),
            matkhau: hashedPassword,
            hoten: hoten.trim(),
            hinhanh: hinhanh || ""
        });

        await newUser.save();

        res.status(201).json({
            message: "Thêm người dùng thành công",
            user: {
                _id: newUser._id,
                email: newUser.email,
                hoten: newUser.hoten,
                hinhanh: newUser.hinhanh
            }
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi server"
        });
    }
});


// API cập nhật người dùng
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, matkhau, hoten, hinhanh } = req.body;

        // Kiểm tra ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ"
            });
        }

        // Kiểm tra kích thước ảnh
        if (hinhanh && hinhanh.length > 8 * 1024 * 1024) {
            return res.status(413).json({
                message: "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn."
            });
        }

        const updateData = {};

        if (email !== undefined) {
            if (!email.trim()) {
                return res.status(400).json({
                    message: "Email không được để trống"
                });
            }

            updateData.email = email.trim();
        }

        if (hoten !== undefined) {
            if (!hoten.trim()) {
                return res.status(400).json({
                    message: "Họ tên không được để trống"
                });
            }

            updateData.hoten = hoten.trim();
        }

        if (hinhanh !== undefined) {
            updateData.hinhanh = hinhanh;
        }

        // Mã hóa mật khẩu mới nếu có
        if (matkhau) {
            updateData.matkhau = await bcrypt.hash(matkhau, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).select("-matkhau");

        if (!updatedUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });
        }

        res.status(200).json({
            message: "Cập nhật người dùng thành công",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi server"
        });
    }
});


// API xóa người dùng
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ"
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });
        }

        res.status(200).json({
            message: "Xóa người dùng thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
});


// Xuất router
module.exports = router;
