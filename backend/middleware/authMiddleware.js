
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Lấy token từ Header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập Admin"
            });
        }

        const token = authHeader.split(" ")[1];

        // Xác thực token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Kiểm tra email Admin
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};

module.exports = authMiddleware;
