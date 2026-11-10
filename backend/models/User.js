
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    matkhau: {
        type: String,
        required: true
    },

    hoten: {
        type: String,
        required: true
    },

    hinhanh: {
    type: String,
    default: ""
}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
