import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login_check`, { email, password });
    return response.data.token; // suponiendo que el token viene en "token"
};

export const getPokemon = async (name, token, lang = "es") => {
    const response = await axios.get(`${API_URL}/pokemon/${name}?lang=${lang}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
