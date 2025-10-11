import { useState } from "react";
import { login, getPokemon } from "./api";

function App() {
    const [email, setEmail] = useState("demo@dexter.com");
    const [password, setPassword] = useState("123456");
    const [token, setToken] = useState(null);
    const [pokemon, setPokemon] = useState(null);
    const [nombrePokemon, setNombrePokemon] = useState("pikachu");

    const handleLogin = async () => {
        try {
            const jwt = await login(email, password);
            setToken(jwt);
            alert("Login exitoso");
        } catch (err) {
            console.error(err);
            alert("Error en login");
        }
    };

    const handleGetPokemon = async () => {
        if (!token) return alert("Necesitas loguearte primero");
        try {
            const data = await getPokemon(nombrePokemon, token, "es");
            setPokemon(data);
        } catch (err) {
            console.error(err);
            alert("Error al obtener Pokémon");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Dexter Web</h1>

            <div>
                <h2>Login</h2>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
                <button onClick={handleLogin}>Login</button>
            </div>

            <hr />

            <div>
                <h2>Buscar Pokémon</h2>
                <input value={nombrePokemon} onChange={e => setNombrePokemon(e.target.value)} />
                <button onClick={handleGetPokemon}>Buscar</button>

                {pokemon && (
                    <div style={{ marginTop: 20 }}>
                        <h3>{pokemon.nombre} (#{pokemon.id})</h3>
                        <p><strong>Descripción:</strong> {pokemon.descripcion || "No hay descripción disponible"}</p>
                        <p><strong>Tipos:</strong> {pokemon.tipos.length ? pokemon.tipos.join(", ") : "No disponible"}</p>
                        <p><strong>Habilidades:</strong> {pokemon.habilidades.length ? pokemon.habilidades.join(", ") : "No disponible"}</p>
                        <img src={pokemon.imagen} alt={pokemon.nombre} width={200} />
                        <img src={pokemon.miniatura} alt={pokemon.nombre} width={50} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
