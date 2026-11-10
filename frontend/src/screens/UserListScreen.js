
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Platform,
    useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import API from "../api/axiosClient";

const COLORS = {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    background: "#F5F7FB",
    white: "#FFFFFF",
    text: "#172B4D",
    secondary: "#64748B",
    muted: "#94A3B8",
    border: "#E5EAF1",
    lightBlue: "#EFF6FF",
    red: "#DC2626",
    lightRed: "#FEF2F2",
};

export default function UserListScreen({
    token,
    onAdd,
    onEdit,
    onDelete,
    onLogout,
}) {
    const { width } = useWindowDimensions();
    const isDesktop = Platform.OS === "web" && width >= 900;

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            setUsers(
                Array.isArray(data)
                    ? data
                    : data.users || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Không thể tải danh sách người dùng."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Tìm kiếm người dùng
    const filteredUsers = users.filter((user) => {
        const keyword = search.toLowerCase().trim();

        return (
            user.hoten?.toLowerCase().includes(keyword) ||
            user.email?.toLowerCase().includes(keyword)
        );
    });

    // Hiển thị từng người dùng
    const renderUser = ({ item }) => (
        <View style={styles.userRow}>
            <View style={styles.userIdentity}>
                {item.hinhanh ? (
                    <Image
                        source={{ uri: item.hinhanh }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>
                            {item.hoten?.charAt(0)?.toUpperCase() || "U"}
                        </Text>
                    </View>
                )}

                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        {item.hoten}
                    </Text>

                    <Text style={styles.userEmail} numberOfLines={1}>
                        {item.email}
                    </Text>
                </View>
            </View>

            <View style={styles.userActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEdit(item)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="create-outline"
                        size={16}
                        color={COLORS.primary}
                    />
                    <Text style={styles.editButtonText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(item._id)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="trash-outline"
                        size={16}
                        color={COLORS.red}
                    />
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            {/* SIDEBAR */}
            {isDesktop && (
                <View style={styles.sidebar}>

                    {/* LOGO */}
                    <View style={styles.logoArea}>
                        <View style={styles.logoIcon}>
                            <Ionicons
                                name="people"
                                size={23}
                                color={COLORS.white}
                            />
                        </View>

                        <View>
                            <Text style={styles.logoTitle}>
                                UserManager
                            </Text>

                            <Text style={styles.logoSubtitle}>
                                MANAGEMENT SYSTEM
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sidebarDivider} />

                    {/* MENU CHÍNH */}
                    <Text style={styles.menuHeading}>
                        MENU CHÍNH
                    </Text>

                    <TouchableOpacity
                        style={styles.activeMenuItem}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="people-outline"
                            size={19}
                            color={COLORS.primary}
                        />

                        <Text style={styles.activeMenuText}>
                            Quản lý người dùng
                        </Text>
                    </TouchableOpacity>

                    {/* THÔNG TIN ADMIN */}
                    <View style={styles.sidebarBottom}>
                        <View style={styles.adminCard}>
                            <View style={styles.adminAvatar}>
                                <Ionicons
                                    name="person"
                                    size={18}
                                    color={COLORS.primary}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.adminName}>
                                    Administrator
                                </Text>

                                <Text style={styles.adminRole}>
                                    Quản trị viên
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={onLogout}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={19}
                                color={COLORS.red}
                            />

                            <Text style={styles.logoutText}>
                                Đăng xuất
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* MAIN CONTENT */}
            <View style={styles.mainContent}>

                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.breadcrumb}>
                            Trang chủ / Quản lý người dùng
                        </Text>

                        <Text style={styles.pageTitle}>
                            Quản lý người dùng
                        </Text>
                    </View>

                    {!isDesktop && (
                        <TouchableOpacity
                            style={styles.mobileLogout}
                            onPress={onLogout}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={17}
                                color={COLORS.red}
                            />

                            <Text style={styles.mobileLogoutText}>
                                Đăng xuất
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* STATISTICS */}
                <View style={styles.statsContainer}>

                    {/* TOTAL USERS */}
                    <View style={styles.statCard}>
                        <View style={styles.statIconBox}>
                            <Ionicons
                                name="people"
                                size={21}
                                color={COLORS.primary}
                            />
                        </View>

                        <View>
                            <Text style={styles.statLabel}>
                                Tổng người dùng
                            </Text>

                            <Text style={styles.statValue}>
                                {users.length}
                            </Text>
                        </View>
                    </View>

                    {/* SEARCH RESULTS */}
                    <View style={styles.statCard}>
                        <View style={[
                            styles.statIconBox,
                            styles.blueIconBox,
                        ]}>
                            <Ionicons
                                name="search-outline"
                                size={21}
                                color={COLORS.primary}
                            />
                        </View>

                        <View>
                            <Text style={styles.statLabel}>
                                Kết quả tìm kiếm
                            </Text>

                            <Text style={styles.statValue}>
                                {filteredUsers.length}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* USER MANAGEMENT */}
                <View style={styles.contentCard}>

                    {/* CARD HEADER */}
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeading}>
                            <Text style={styles.cardTitle}>
                                Danh sách người dùng
                            </Text>

                            <Text style={styles.cardDescription}>
                                Quản lý thông tin tài khoản trong hệ thống
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={onAdd}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="add"
                                size={19}
                                color={COLORS.white}
                            />

                            <Text style={styles.addButtonText}>
                                Thêm người dùng
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* SEARCH BAR */}
                    <View style={styles.searchArea}>
                        <View style={styles.searchBox}>
                            <Ionicons
                                name="search"
                                size={18}
                                color={COLORS.muted}
                            />

                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm theo họ tên hoặc email..."
                                placeholderTextColor={COLORS.muted}
                                value={search}
                                onChangeText={setSearch}
                            />

                            {search.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setSearch("")}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={17}
                                        color={COLORS.muted}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={fetchUsers}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={17}
                                color={COLORS.text}
                            />

                            <Text style={styles.refreshText}>
                                Làm mới
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* TABLE HEADER - DESKTOP */}
                    {isDesktop && (
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>
                                THÔNG TIN NGƯỜI DÙNG
                            </Text>

                            <Text style={styles.tableHeaderText}>
                                THAO TÁC
                            </Text>
                        </View>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <View style={styles.centerBox}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />

                            <Text style={styles.loadingText}>
                                Đang tải dữ liệu...
                            </Text>
                        </View>
                    ) : error ? (
                        /* ERROR */
                        <View style={styles.centerBox}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={35}
                                color={COLORS.red}
                            />

                            <Text style={styles.errorText}>
                                {error}
                            </Text>

                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={fetchUsers}
                            >
                                <Text style={styles.retryText}>
                                    Thử lại
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredUsers.length === 0 ? (
                        /* EMPTY */
                        <View style={styles.centerBox}>
                            <Ionicons
                                name="people-outline"
                                size={42}
                                color="#CBD5E1"
                            />

                            <Text style={styles.emptyTitle}>
                                Không tìm thấy người dùng
                            </Text>

                            <Text style={styles.emptyDescription}>
                                Hãy thử từ khóa khác hoặc thêm người dùng mới.
                            </Text>
                        </View>
                    ) : (
                        /* USER LIST */
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item._id}
                            renderItem={renderUser}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
                    )}

                    {/* FOOTER */}
                    <View style={styles.cardFooter}>
                        <Text style={styles.footerText}>
                            Hiển thị {filteredUsers.length} / {users.length} người dùng
                        </Text>
                    </View>
                </View>

                {/* COPYRIGHT */}
                <Text style={styles.footerCopyright}>
                    UserManager © 2026. All rights reserved.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    // GENERAL
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: COLORS.background,
        minHeight: "100%",
    },

    // SIDEBAR
    sidebar: {
        width: 250,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
    },

    logoArea: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 25,
    },

    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    logoTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: "700",
    },

    logoSubtitle: {
        color: COLORS.muted,
        fontSize: 9,
        marginTop: 3,
        letterSpacing: 0.7,
    },

    sidebarDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 22,
    },

    menuHeading: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.muted,
        letterSpacing: 0.8,
        marginBottom: 12,
        marginLeft: 8,
    },

    activeMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.lightBlue,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        gap: 11,
    },

    activeMenuText: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 13,
    },

    sidebarBottom: {
        marginTop: "auto",
    },

    adminCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        padding: 11,
        borderRadius: 9,
        marginBottom: 12,
    },

    adminAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    adminName: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: "600",
    },

    adminRole: {
        color: COLORS.muted,
        fontSize: 11,
        marginTop: 3,
    },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 11,
        paddingHorizontal: 10,
        gap: 10,
    },

    logoutText: {
        color: COLORS.red,
        fontSize: 13,
        fontWeight: "600",
    },

    // MAIN CONTENT
    mainContent: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 25,
        paddingBottom: 20,
        minWidth: 0,
    },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 23,
    },

    breadcrumb: {
        fontSize: 12,
        color: COLORS.muted,
        marginBottom: 7,
    },

    pageTitle: {
        color: COLORS.text,
        fontSize: 23,
        fontWeight: "700",
    },

    mobileLogout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: COLORS.lightRed,
        paddingHorizontal: 11,
        paddingVertical: 9,
        borderRadius: 8,
    },

    mobileLogoutText: {
        color: COLORS.red,
        fontSize: 12,
        fontWeight: "600",
    },

    // STATISTICS
    statsContainer: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 11,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    statIconBox: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: COLORS.lightBlue,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    blueIconBox: {
        backgroundColor: "#DBEAFE",
    },

    statLabel: {
        color: COLORS.secondary,
        fontSize: 12,
    },

    statValue: {
        color: COLORS.text,
        fontSize: 21,
        fontWeight: "700",
        marginTop: 5,
    },

    // CONTENT CARD
    contentCard: {
        flex: 1,
        minHeight: 300,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20,
    },

    cardHeading: {
        flex: 1,
        minWidth: 0,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
    },

    cardDescription: {
        color: COLORS.muted,
        fontSize: 12,
        marginTop: 5,
    },

    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        minHeight: 40,
        minWidth: 155,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        flexShrink: 0,
    },

    addButtonText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 12,
    },

    // SEARCH
    searchArea: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },

    searchBox: {
        flex: 1,
        minWidth: 0,
        height: 42,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 9,
    },

    searchInput: {
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        color: COLORS.text,
        outlineStyle: "none",
    },

    refreshButton: {
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
    },

    refreshText: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "600",
    },

    // TABLE HEADER
    tableHeader: {
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    tableHeaderText: {
        color: COLORS.secondary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.4,
    },

    // USER LIST
    listContent: {
        paddingBottom: 8,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
        gap: 10,
        minHeight: 72,
    },

    userIdentity: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
        backgroundColor: "#E2E8F0",
    },

    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarLetter: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "700",
    },

    userInfo: {
        flex: 1,
        minWidth: 0,
    },

    userName: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: "600",
    },

    userEmail: {
        color: COLORS.secondary,
        fontSize: 12,
        marginTop: 5,
    },

    userActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    editButton: {
        backgroundColor: COLORS.lightBlue,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },

    editButtonText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "600",
    },

    deleteButton: {
        backgroundColor: COLORS.lightRed,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },

    deleteButtonText: {
        color: COLORS.red,
        fontSize: 12,
        fontWeight: "600",
    },

    // LOADING / EMPTY / ERROR
    centerBox: {
        flex: 1,
        minHeight: 180,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    loadingText: {
        color: COLORS.secondary,
        marginTop: 12,
        fontSize: 12,
    },

    errorText: {
        color: COLORS.red,
        fontSize: 13,
        textAlign: "center",
        marginTop: 8,
    },

    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 7,
        marginTop: 12,
    },

    retryText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 12,
    },

    emptyTitle: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
    },

    emptyDescription: {
        color: COLORS.secondary,
        fontSize: 12,
        marginTop: 7,
        textAlign: "center",
    },

    // FOOTER
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 13,
        marginTop: 8,
    },

    footerText: {
        color: COLORS.secondary,
        fontSize: 11,
    },

    footerCopyright: {
        color: COLORS.muted,
        fontSize: 10,
        textAlign: "center",
        marginTop: 16,
    },
});
