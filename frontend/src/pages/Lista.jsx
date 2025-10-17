import { useEffect, useState } from "react";
import { getPokemonList, getPokemonDetails } from "../api";
import PokemonCardLista from "../components/PokemonCardLista";
import functions from "../utils/functions.js";
import "../assets/css/Lista.css";

export default function Lista() {
    const [index, setIndex] = useState({});
    const [filteredIds, setFilteredIds] = useState([]);
    const [pageDetails, setPageDetails] = useState([]);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [indexLoading, setIndexLoading] = useState(true);

    const limit = 16;
    const CACHE_KEY = "pokemonIndex";
    const CACHE_EXPIRY_DAYS = 7;

    // 🧠 Carga índice desde cache o API
    useEffect(() => {
        const loadIndex = async () => {
            const saved = localStorage.getItem(CACHE_KEY);

            if (saved) {
                const { data, timestamp } = JSON.parse(saved);
                const ageDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

                // Si el índice tiene menos de 7 días → úsalo directamente
                if (ageDays < CACHE_EXPIRY_DAYS) {
                    setIndex(data);
                    setFilteredIds(Object.keys(data).map(Number));
                    setIndexLoading(false);
                    return;
                }
            }

            // Si no hay cache o está viejo → vuelve a cargar
            // console.log("🆕 Descargando índice de PokéAPI...");
            const apiData = await getPokemonList(10000, 0);
            const dict = {};
            apiData.results.forEach((p) => {
                const id = parseInt(p.url.split("/").slice(-2, -1)[0]);
                dict[id] = p.name;
            });

            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ data: dict, timestamp: Date.now() })
            );

            setIndex(dict);
            setFilteredIds(Object.keys(dict).map(Number));
            setIndexLoading(false);
        };

        loadIndex();
    }, []);

    // 🔎 Filtrado por nombre
    useEffect(() => {
        if (!filter) {
            setFilteredIds(Object.keys(index).map(Number));
            return;
        }
        const q = filter.toLowerCase();
        const results = Object.entries(index)
            .filter(([id, name]) => name.toLowerCase().includes(q))
            .map(([id]) => Number(id));

        setFilteredIds(results);
        setCurrentPage(1);
    }, [filter, index]);

    // 📄 Paginación
    const offset = (currentPage - 1) * limit;
    const paginatedIds = filteredIds.slice(offset, offset + limit);
    const totalPages = Math.ceil(filteredIds.length / limit);

    // 🧩 Cargar detalles de los visibles
    useEffect(() => {
        if (paginatedIds.length === 0) {
            setPageDetails([]);
            return;
        }

        const loadDetails = async () => {
            setLoading(true);
            try {
                const details = await Promise.all(
                    paginatedIds.map((id) =>
                        getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                    )
                );
                setPageDetails(details);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [paginatedIds]);

    // 📜 Rango de botones
    const getPageNumbers = () => {
        const maxButtons = 5;
        const pages = [];
        if (totalPages <= maxButtons) {
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

    // 🖼️ Render
    // if (indexLoading)
    //     return <p style={{ textAlign: "center" }}>Cargando índice Pokémon...</p>;

    return (
        <div className="pokemon-list-page" style={{ padding: "20px" }}>
            {/* 🔍 Buscador */}
            <div className="search">
                <h2>Buscar Pokémon</h2>
                <input
                    className="input_text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Ej: char, pika, luca..."
                />
            </div>

            {/*<p style={{ textAlign: "center", marginTop: "10px" }}>*/}
            {/*    {loading*/}
            {/*        ? "Cargando..."*/}
            {/*        : `Mostrando ${filteredIds.length} resultados`}*/}
            {/*</p>*/}

            {/* 🧱 Lista */}
            <div
                className="pokemon-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                    justifyItems: "center",
                    marginTop: "20px",
                }}
            >
                {pageDetails.map((pokemon) => (
                    <PokemonCardLista
                        key={pokemon.id}
                        megaPokemon={index} // <--- pasamos el diccionario
                        pokemon={{
                            id: functions.formatPokeNum(pokemon.id),
                            nombre: pokemon.name,
                            tipos: pokemon.types.map((t) => t.type.name),
                            habilidades: pokemon.abilities.map((a) => a.ability.name),
                            miniatura: functions.getMiniatura(pokemon.id, pokemon.name, index),
                        }}
                    />
                ))}
            </div>

            {/* 📜 Paginación */}
            {filteredIds.length > 0 && (
                <div className="pagination" style={{ marginTop: 20 }}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ◀
                    </button>

                    {getPageNumbers().map((page, i) =>
                            page === "..." ? (
                                <span key={`ellipsis-${i}`} className="ellipsis">
                ...
              </span>
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
            )}
        </div>
    );
}
