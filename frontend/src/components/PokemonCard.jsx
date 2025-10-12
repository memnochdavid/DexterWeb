import typeColors from "../utils/typeColors.js";
import "../assets/css/PokemonCard.css"; // por si quieres estilizarlo más
import TypeCard from "./TypeCard";
import functions from "../utils/functions.js";

export default function PokemonCard({ pokemon }) {
    if (!pokemon) return null;

    const tipos = pokemon.tipos.map(t => t.toLowerCase());
    const color1 = typeColors[tipos[0]] || "#ccc";
    const color2 = tipos[1] ? typeColors[tipos[1]] : color1;

    const bgStyle = {
        background: tipos[1]
            ? `linear-gradient(180deg, ${color1} 50%, ${color2} 50%)`
            : color1
    };

    return (
        <div className="card-container">
            <div className="upper-container" style={bgStyle}>
                <div className="image-container">
                    <img src={pokemon.imagen} alt={pokemon.nombre}/>
                </div>
            </div>

            <div className="lower-container">
                <div>
                    <h3>#{functions.formatPokeNum(pokemon.id)} {pokemon.nombre}</h3>
                    <h4>
                        {/*Tipos: {pokemon.tipos.join(", ") || "No disponible"}*/}
                        <div className="types-container">
                            {pokemon.tipos.map((tipo) => (
                                <TypeCard key={tipo} tipo={tipo} />
                            ))}
                        </div>
                    </h4>
                </div>
                <div>
                    <p>Habilidades: {pokemon.habilidades.join(", ") || "No disponible"}</p>
                    <p>{pokemon.descripcion || "No hay descripción disponible"}</p>
                </div>
            </div>
        </div>
    );
}