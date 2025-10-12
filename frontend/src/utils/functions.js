function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}
function getMiniatura(id) {
    const idPadded = String(id).padStart(4, "0");
    return `https://resource.pokemon-home.com/battledata/img/pokei128/icon${idPadded}_f00_s0.png`;
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



export default {
    capitalize,
    getMiniatura,
    formatPokeNum,
};