import { megaPokemon } from './Dictionaries.js';
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}
function getMiniatura(id, nombre) {
    let forma = "";

    switch (extraerMega(nombre)) {
        case "-mega":
            forma = "f01";
            break;
        case "-mega-x":
            forma = "f01";
            break;
        case "-mega-y":
            forma = "f02";
            break;
        case "-hisui":
            forma = "f01";
            break;
        case "-galar":
            forma = "f01";
            break;
        case "-paldea":
            forma = "f01";
            break;
        case "alola":
            forma = "f01";
            break;
        default:
            forma = "f00";
            break;
    }

    let idPadded = String(id).padStart(4, "0");
    let plantilla = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${idPadded}_${forma}_s0.png`;

    if (!nombre.includes("-mega") && !nombre.includes("-gmax")) {
        return plantilla;
    } else {
        let baseName = nombre
            .replace("-mega-x", "")
            .replace("-mega-y", "")
            .replace("-mega", "")
            .replace("-hisui", "")
            .replace("-galar", "")
            .replace("-alola", "")
            .replace("-paldea", "")
            .toLowerCase();

        // const megaPokemon = JSON.parse(localStorage.getItem("pokemonIndex") || "{}").data || {};
        const newId = megaPokemon[baseName];

        if (!newId) return plantilla;

        const newIdPadded = String(newId).padStart(4, "0");
        plantilla = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${newIdPadded}_${forma}_s0.png`;
        return plantilla;
    }
}


function formatPokeNum(id, opc = "format") {
    if (opc === "format") {
        let num= id.toString().length;
        switch (num) {
            case 1:
                return `000${id}`;
            case 2:
                return `00${id}`;
            case 3:
                return `0${id}`;
            default:
                return id;
        }
    }
    else if (opc === "deformat") {
        let num = parseInt(id);
        return num;
    }
}
function extraerMega(nombre) {
    // La expresión busca "-mega", opcionalmente seguido de "-x" o "-y"
    // const resultado = nombre.match(/-mega(-x|-y)?/i);
    const resultado = nombre.match(/-(mega(-x|-y)?|gmax|alola|galar|hisui)/i);
    return resultado ? resultado[0] : null;
}


export default {
    capitalize,
    getMiniatura,
    formatPokeNum,
};