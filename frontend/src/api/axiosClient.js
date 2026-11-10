
import axios from "axios";
import { Platform } from "react-native";

const API = axios.create({
    baseURL:
        Platform.OS === "web"
            ? "http://localhost:4000/api"
            : "http://10.0.2.2:4000/api",

    headers: {
        "Content-Type": "application/json"
    }
});

export default API;
