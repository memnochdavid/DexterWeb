import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemonDetails } from "../api";
import PokemonCard from "../components/PokemonCard.jsx";
import functions from "../utils/functions.js";

export default function Ficha() {
    const { id } = useParams(); // Captura el ID de la URL
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPokemon = async () => {
            try {
                setLoading(true);
                const data = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}`);

                setPokemon({
                    id: data.id,
                    nombre: functions.capitalize(data.name),
                    tipos: data.types.map(t => t.type.name),
                    habilidades: data.abilities.map(a => a.ability.name),
                    imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
                    descripcion: "", // opcional: puedes usar flavor_text de species si quieres
                });
            } catch (err) {
                console.error("Error cargando Pokémon:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPokemon();
    }, [id]);

    if (loading) return <p style={{ textAlign: "center" }}>Cargando...</p>;
    if (!pokemon) return <p>Pokémon no encontrado</p>;

    return (
        <div style={{ padding: "20px" }}>
            <PokemonCard pokemon={pokemon} />
        </div>
    );
}
