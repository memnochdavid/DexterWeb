import { useEffect, useState } from "react";
import { getPokemonList, getPokemonDetails } from "../api";
import PokemonCardLista from "../components/PokemonCardLista";
import functions from "../utils/functions.js";
import "../assets/css/Lista.css";


export default function Lista() {
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPokemon, setTotalPokemon] = useState(0);
    const [loading, setLoading] = useState(false);

    const limit = 16; // Pokémon por página

    // function getMiniatura(id) {
    //     const idPadded = String(id).padStart(4, "0");
    //     return `https://resource.pokemon-home.com/battledata/img/pokei128/icon${idPadded}_f00_s0.png`;
    // }

    useEffect(() => {
        loadPokemon(currentPage);
    }, [currentPage]);

    const loadPokemon = async (page) => {
        setLoading(true);
        try {
            const offset = (page - 1) * limit;
            const data = await getPokemonList(limit, offset);
            setTotalPokemon(data.count);

            const details = await Promise.all(
                data.results.map((p) => getPokemonDetails(p.url))
            );

            const sorted = [...details].sort((a, b) => a.id - b.id);
            setPokemonList(sorted);
        } catch (error) {
            console.error("Error cargando Pokémon:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalPokemon / limit);

    /** 🔢 Función para generar el rango de páginas a mostrar */
    const getPageNumbers = () => {
        const maxButtons = 5;
        const pages = [];

        if (totalPages <= maxButtons) {
            // Mostrar todas si son pocas
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, currentPage + 2);

            if (start > 1) pages.push(1, "...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) pages.push("...", totalPages);
        }
        return pages;
    };

    return (
        <div className="pokemon-list-page" style={{ padding: "20px" }}>
            {/*<h2>Lista de Pokémon</h2>*/}


            {/* 📜 Paginación dinámica */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ◀
                </button>

                {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                        <span key={`ellipsis-${i}`} className="ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            className={page === currentPage ? "active" : ""}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    ▶
                </button>
            </div>

            <div className="pokemon-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                justifyItems: "center"
            }}>
                {/*{loading && <p style={{ textAlign: "center" }}>Cargando...</p>}*/}
                {pokemonList.map((pokemon) => (
                    <PokemonCardLista
                        key={pokemon.id}
                        pokemon={{
                            id: functions.formatPokeNum(pokemon.id),
                            nombre: pokemon.name,
                            tipos: pokemon.types.map((t) => t.type.name),
                            habilidades: pokemon.abilities.map(
                                (a) => a.ability.name
                            ),
                            miniatura: functions.getMiniatura(pokemon.id),
                        }}
                    />
                ))}
            </div>

            {/*{loading && <p style={{ textAlign: "center" }}>Cargando...</p>}*/}

            {/* 📜 Paginación dinámica */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ◀
                </button>

                {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                        <span key={`ellipsis-${i}`} className="ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            className={page === currentPage ? "active" : ""}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}
