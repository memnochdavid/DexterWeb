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

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export async function getPokemonList(limit = 5, offset = 0) {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Error al obtener lista de Pokémon");
    return await response.json();
}

export async function getPokemonDetails(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener detalles del Pokémon");
    return await response.json();
}
export async function getPokemonSpecies(url) {
    const res = await fetch(url);
    return await res.json();
}
