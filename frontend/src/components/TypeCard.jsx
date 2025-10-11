import typeColors from "../utils/typeColors";
import "../assets/css/TypeCard.css";

export default function TypeCard({ tipo }) {
    if (!tipo) return null;

    // Mapear nombres inglés → español (para el archivo y texto)
    const traducciones = {
        grass: "planta",
        water: "agua",
        fire: "fuego",
        fighting: "lucha",
        poison: "veneno",
        steel: "acero",
        bug: "bicho",
        dragon: "dragón",
        electric: "eléctrico",
        fairy: "hada",
        ice: "hielo",
        psychic: "psíquico",
        rock: "roca",
        ground: "tierra",
        dark: "siniestro",
        normal: "normal",
        flying: "volador",
        ghost: "fantasma"
    };

    const tipoEsp = traducciones[tipo.toLowerCase()] || tipo;
    const color = typeColors[tipo.toLowerCase()] || "#aaa";
    const imgSrc = `/src/assets/img/tipos/${tipo}.svg`;

    return (
        <div
            className="type-card"
            style={{ backgroundColor: color }}
        >
            <img src={imgSrc} alt={tipoEsp} className="type-icon" />
            <span className="type-name">{tipoEsp}</span>
        </div>
    );
}