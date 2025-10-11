import typeColors from "../utils/typeColors";
import "../assets/css/PokemonCard.css";
import TypeCard from "./TypeCard";

export default function PokemonCardLista({ pokemon }) {
    if (!pokemon) return null;

    const tipos = pokemon.tipos.map(t => t.toLowerCase());
    const color1 = typeColors[tipos[0]] || "#ccc";
    const color2 = tipos[1] ? typeColors[tipos[1]] : color1;

    const bgStyle = {
        background: tipos[1]
            ? `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`
            : color1,
    };

    return (
        <div className="card-horizontal responsive-card" style={bgStyle}>
            <div className="image-container-horizontal">
                <img src={pokemon.miniatura} alt={pokemon.nombre} />
            </div>

            <div className="info-container-horizontal">
                <div className="name-type">
                    <h3>{pokemon.nombre}</h3>
                    <h4>#{pokemon.id}</h4>
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
