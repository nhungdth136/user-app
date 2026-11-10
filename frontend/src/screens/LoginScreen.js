
import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";

import API from "../api/axiosClient";

export default function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [matkhau, setMatkhau] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !matkhau) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/login", {
                email,
                matkhau
            });

            onLogin(response.data.token);

        } catch (error) {
            Alert.alert(
                "Đăng nhập thất bại",
                error.response?.data?.message || "Không thể kết nối Backend"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                QUẢN LÝ NGƯỜI DÙNG
            </Text>

            <Text style={styles.subtitle}>
                Đăng nhập hệ thống quản trị
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email Admin"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={matkhau}
                onChangeText={setMatkhau}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        backgroundColor: "#f4f6f9"
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#2563eb",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
        marginBottom: 30
    },
    input: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "white",
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd"
    },
    button: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#2563eb",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    }
});
