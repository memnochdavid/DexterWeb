import typeColors from "../utils/typeColors.js";
import "../assets/css/PokemonCardLista.css";
import TypeCard from "./TypeCard";
import functions from "../utils/functions.js";
import { useNavigate } from "react-router-dom";

export default function PokemonCardLista({ pokemon }) {
    const navigate = useNavigate();
    if (!pokemon) return null;

    const tipos = pokemon.tipos.map(t => t.toLowerCase());
    const color1 = typeColors[tipos[0]] || "#ccc";

    const color2 = tipos[1] ? typeColors[tipos[1]] : color1;

    const bgStyle = {
        background: tipos[1]
            ? `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`
            : color1,
    };
    const handleClick = () => {
        navigate(`/ficha/${functions.formatPokeNum(pokemon.id, "deformat")}`); // ⚡ Navega a la ficha del Pokémon
    };

    return (
        <div className="card-horizontal responsive-card"
             style={bgStyle} onClick={handleClick}>
            <div className="image-container-horizontal">
                <img src={pokemon.miniatura} alt={pokemon.nombre} />
            </div>

            <div className="info-container-horizontal">
                <div className="name-type">
                    <h3>{functions.capitalize(pokemon.nombre)}</h3>
                    <h4>#{functions.formatPokeNum(pokemon.id)}</h4>
                    <div className="types-container">
                        {pokemon.tipos.map((tipo) => (
                            <TypeCard key={tipo} tipo={tipo} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
