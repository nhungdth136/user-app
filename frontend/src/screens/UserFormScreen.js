
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../api/axiosClient";

const BLUE = "#2563EB";

export default function UserFormScreen({ token, onBack, onSuccess }) {
    const [hoten, setHoten] = useState("");
    const [email, setEmail] = useState("");
    const [matkhau, setMatkhau] = useState("");
    const [hinhanh, setHinhanh] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const chooseImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];

            if (!asset.base64) {
                Alert.alert("Thông báo", "Không thể đọc ảnh đã chọn.");
                return;
            }

            const mimeType = asset.mimeType || "image/jpeg";
            setHinhanh(`data:${mimeType};base64,${asset.base64}`);
            setFileName(asset.fileName || "Ảnh đã chọn");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể mở thư viện ảnh.");
        }
    };

    const handleSubmit = async () => {
        if (!hoten.trim() || !email.trim() || !matkhau.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập họ tên, email và mật khẩu.");
            return;
        }

        try {
            setLoading(true);

            await API.post(
                "/users",
                {
                    hoten: hoten.trim(),
                    email: email.trim(),
                    matkhau,
                    hinhanh,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Alert.alert("Thành công", "Đã thêm người dùng mới.");
            onSuccess();
        } catch (error) {
            Alert.alert(
                "Không thể thêm người dùng",
                error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.pageHeader}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>← Quay lại</Text>
                    </TouchableOpacity>

                    <Text style={styles.breadcrumb}>
                        Quản lý người dùng / Thêm mới
                    </Text>

                    <Text style={styles.pageTitle}>Thêm người dùng</Text>
                    <Text style={styles.pageDescription}>
                        Nhập thông tin để tạo tài khoản người dùng mới.
                    </Text>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Text style={styles.sectionIconText}>♙</Text>
                        </View>
                        <View>
                            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                            <Text style={styles.sectionDescription}>
                                Các trường có dấu * là bắt buộc
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Họ và tên *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập họ và tên"
                        placeholderTextColor="#94A3B8"
                        value={hoten}
                        onChangeText={setHoten}
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#94A3B8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Mật khẩu *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        placeholderTextColor="#94A3B8"
                        value={matkhau}
                        onChangeText={setMatkhau}
                        secureTextEntry
                    />

                    <Text style={styles.passwordHint}>
                        Mật khẩu sẽ được mã hóa trước khi lưu vào hệ thống.
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Ảnh đại diện</Text>
                    <View style={styles.imageSection}>
                        <View style={styles.imagePreview}>
                            {hinhanh ? (
                                <Image
                                    source={{ uri: hinhanh }}
                                    style={styles.previewImage}
                                />
                            ) : (
                                <Text style={styles.imagePlaceholder}>Ảnh</Text>
                            )}
                        </View>

                        <View style={styles.imageDetails}>
                            <Text style={styles.imageTitle}>Ảnh người dùng</Text>
                            <Text style={styles.imageHint}>
                                Chọn ảnh từ thiết bị của bạn.
                            </Text>

                            <TouchableOpacity
                                style={styles.chooseFileButton}
                                onPress={chooseImage}
                            >
                                <Text style={styles.chooseFileText}>＋ Chọn tệp</Text>
                            </TouchableOpacity>

                            {fileName ? (
                                <Text style={styles.fileName} numberOfLines={1}>
                                    {fileName}
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onBack}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitText}>Lưu người dùng</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F4F7FC",
        minHeight: "100%",
    },
    scrollContent: {
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
        padding: 24,
        paddingBottom: 40,
    },
    pageHeader: {
        marginBottom: 22,
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
        marginBottom: 17,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    backText: {
        color: BLUE,
        fontSize: 12,
        fontWeight: "600",
    },
    breadcrumb: {
        color: "#64748B",
        fontSize: 12,
        marginBottom: 8,
    },
    pageTitle: {
        color: "#172B4D",
        fontSize: 25,
        fontWeight: "bold",
    },
    pageDescription: {
        color: "#64748B",
        fontSize: 13,
        marginTop: 7,
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    sectionIconText: {
        color: BLUE,
        fontSize: 21,
    },
    sectionTitle: {
        color: "#172B4D",
        fontSize: 15,
        fontWeight: "bold",
    },
    sectionDescription: {
        color: "#94A3B8",
        fontSize: 11,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginBottom: 20,
    },
    label: {
        color: "#334155",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 3,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#DCE3ED",
        borderRadius: 8,
        paddingHorizontal: 13,
        fontSize: 13,
        color: "#172B4D",
        backgroundColor: "#FFFFFF",
        marginBottom: 17,
    },
    passwordHint: {
        color: "#94A3B8",
        fontSize: 11,
        marginTop: -10,
        marginBottom: 20,
    },
    imageSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 10,
        padding: 14,
        marginBottom: 24,
    },
    imagePreview: {
        width: 76,
        height: 76,
        borderRadius: 10,
        backgroundColor: "#EAF0F8",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginRight: 15,
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        color: "#94A3B8",
        fontSize: 12,
    },
    imageDetails: {
        flex: 1,
        minWidth: 0,
        alignItems: "flex-start",
    },
    imageTitle: {
        color: "#334155",
        fontSize: 12,
        fontWeight: "600",
    },
    imageHint: {
        color: "#94A3B8",
        fontSize: 11,
        marginTop: 4,
        marginBottom: 9,
    },
    chooseFileButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#BFDBFE",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    chooseFileText: {
        color: BLUE,
        fontSize: 11,
        fontWeight: "600",
    },
    fileName: {
        color: "#64748B",
        fontSize: 10,
        marginTop: 6,
        maxWidth: "100%",
    },
    formActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 19,
    },
    cancelButton: {
        minWidth: 85,
        height: 42,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    cancelText: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "600",
    },
    submitButton: {
        minWidth: 145,
        height: 42,
        borderRadius: 8,
        backgroundColor: BLUE,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    submitText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
});
