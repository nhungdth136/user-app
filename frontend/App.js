
import React, { useState } from "react";
import {
    Alert,
    Platform,
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import UserListScreen from "./src/screens/UserListScreen";
import UserFormScreen from "./src/screens/UserFormScreen";
import EditUserScreen from "./src/screens/EditUserScreen";

import API from "./src/api/axiosClient";

export default function App() {
    const [token, setToken] = useState(null);
    const [screen, setScreen] = useState("list");
    const [reload, setReload] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    // Trạng thái hộp thoại xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Tải lại danh sách
    const refreshList = () => {
        setReload(prev => prev + 1);
    };

    // Hiển thị thông báo
    const showMessage = (title, message) => {
        if (Platform.OS === "web") {
            window.alert(`${title}\n${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    // Mở hộp thoại xác nhận xóa
    const handleDelete = (id) => {
        console.log("Nhận yêu cầu xóa:", id);

        if (!id) {
            showMessage("Lỗi", "Không tìm thấy ID người dùng!");
            return;
        }

        setSelectedDeleteId(id);
        setShowDeleteModal(true);
    };

    // Đóng hộp thoại
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedDeleteId(null);
    };

    // Xác nhận và thực hiện xóa
    const confirmDelete = async () => {
        if (!selectedDeleteId || deleting) {
            return;
        }

        try {
            setDeleting(true);

            console.log("Đang gửi yêu cầu xóa:", selectedDeleteId);

            const response = await API.delete(
                `/users/${selectedDeleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Xóa thành công:", response.data);

            setShowDeleteModal(false);
            setSelectedDeleteId(null);

            refreshList();

            showMessage(
                "Thành công",
                "Đã xóa người dùng thành công!"
            );

        } catch (error) {
            console.log("Lỗi xóa:", error.response?.data || error.message);

            const message =
                error.response?.data?.message ||
                "Không thể xóa người dùng!";

            setShowDeleteModal(false);
            setSelectedDeleteId(null);

            showMessage("Lỗi", message);

        } finally {
            setDeleting(false);
        }
    };

    // Chưa đăng nhập
    if (!token) {
        return <LoginScreen onLogin={setToken} />;
    }

    // Nội dung màn hình hiện tại
    let currentScreen;

    if (screen === "add") {
        currentScreen = (
            <UserFormScreen
                token={token}
                onBack={() => setScreen("list")}
                onSuccess={() => {
                    setScreen("list");
                    refreshList();
                }}
            />
        );
    } else if (screen === "edit") {
        currentScreen = (
            <EditUserScreen
                token={token}
                user={selectedUser}
                onBack={() => setScreen("list")}
                onSuccess={() => {
                    setScreen("list");
                    refreshList();
                }}
            />
        );
    } else {
        currentScreen = (
            <UserListScreen
                key={reload}
                token={token}
                onAdd={() => setScreen("add")}
                onEdit={(user) => {
                    setSelectedUser(user);
                    setScreen("edit");
                }}
                onDelete={handleDelete}
                onLogout={() => {
                    setToken(null);
                    setScreen("list");
                    setSelectedUser(null);
                }}
            />
        );
    }

    return (
        <>
            {currentScreen}

            {/* Hộp thoại xác nhận xóa */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={cancelDelete}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>

                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>!</Text>
                        </View>

                        <Text style={styles.modalTitle}>
                            Xác nhận xóa
                        </Text>

                        <Text style={styles.modalMessage}>
                            Bạn có chắc chắn muốn xóa người dùng này không?
                            {"\n"}
                            Hành động này không thể hoàn tác.
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={cancelDelete}
                                disabled={deleting}
                            >
                                <Text style={styles.cancelText}>
                                    Hủy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.confirmButton,
                                    deleting && styles.disabledButton
                                ]}
                                onPress={confirmDelete}
                                disabled={deleting}
                            >
                                <Text style={styles.confirmText}>
                                    {deleting ? "Đang xóa..." : "Xóa"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },

    modalContainer: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        elevation: 10
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },

    icon: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#DC2626"
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 12
    },

    modalMessage: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24
    },

    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 12
    },

    cancelButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center"
    },

    cancelText: {
        color: "#374151",
        fontSize: 14,
        fontWeight: "600"
    },

    confirmButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center"
    },

    confirmText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600"
    },

    disabledButton: {
        opacity: 0.6
    }
});
