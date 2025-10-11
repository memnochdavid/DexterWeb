import {useState} from "react";
import {getPokemon} from "../api";
import {useAuth} from "../context/AuthContext";
import PokemonCard from "../components/PokemonCard";
import PokemonCardLista from "../components/PokemonCardLista";
import '../assets/css/Home.css';

export default function Home() {
    const {token} = useAuth();
    const [nombrePokemon, setNombrePokemon] = useState("pikachu");
    const [pokemon, setPokemon] = useState(null);

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
        <div className="home-container">
            <div className="search">
                <h2>Buscar Pokémon</h2>
                <input className={"input_text"} value={nombrePokemon} onChange={e => setNombrePokemon(e.target.value)}/>
                <button onClick={handleGetPokemon}>Buscar</button>
            </div>
            <div className="card_lista">
                <PokemonCardLista pokemon={pokemon}/>
            </div>
            <div className="card_grande">
                <PokemonCard pokemon={pokemon}/>
            </div>
        </div>
    );
}
