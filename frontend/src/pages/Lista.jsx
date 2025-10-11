import { useEffect, useState, useRef } from "react";
import { getPokemonList, getPokemonDetails } from "../api";
import PokemonCard from "../components/PokemonCard";
import '../assets/css/Lista.css';
import PokemonCardLista from "../components/PokemonCardLista.jsx";

export default function Lista() {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const limit = 20; // nº de Pokémon por página

    useEffect(() => {
        loadMorePokemon();
    }, []);

    useEffect(() => {
        // IntersectionObserver: para lazy loading
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMorePokemon();
            }
        }, { threshold: 1 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loaderRef, hasMore, loading]);

    const loadMorePokemon = async () => {
        setLoading(true);
        try {
            const data = await getPokemonList(limit, offset);
            const details = await Promise.all(
                data.results.map(p => getPokemonDetails(p.url))
            );

            setPokemonList(prev => [...prev, ...details]);
            setOffset(prev => prev + limit);
            if (!data.next) setHasMore(false);
        } catch (error) {
            console.error("Error cargando Pokémon:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pokemon-list-page" style={{ padding: "20px" }}>
            <h2>Lista de Pokémon</h2>
            <div className="pokemon-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                justifyItems: "center"
            }}>

                {pokemonList.map((pokemon, index) => (
                    <PokemonCardLista
                        key={`${pokemon.name || pokemon.id || index}`}  // ✅ única siempre
                        pokemon={{
                            id: pokemon.id,
                            nombre: pokemon.name,
                            tipos: pokemon.types?.map((t) => t.type.name) || [],
                            habilidades: pokemon.abilities?.map((a) => a.ability.name) || [],
                            miniatura: getMiniatura(pokemon.id),
                            descripcion: "",
                        }}
                    />
                ))}


            </div>

            {loading && <p style={{ textAlign: "center" }}>Cargando...</p>}
            {hasMore && <div ref={loaderRef} style={{ height: "50px" }}></div>}
        </div>
    );

    function getMiniatura(id) {
        const idPadded = String(id).padStart(4, '0');
        return `https://resource.pokemon-home.com/battledata/img/pokei128/icon${idPadded}_f00_s0.png`;
    }
}
