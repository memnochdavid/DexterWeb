<?php

$mega_pokemon = [
    "venusaur"    => 3,
    "charizard"   => 6,
    "blastoise"   => 9,
    "beedrill"    => 15,
    "pidgeot"     => 18,
    "alakazam"    => 65,
    "slowbro"     => 80,
    "gengar"      => 94,
    "kangaskhan"  => 115,
    "pinsir"      => 127,
    "gyarados"    => 130,
    "aerodactyl"  => 142,
    "mewtwo"      => 150,
    "ampharos"    => 181,
    "steelix"     => 208,
    "scizor"      => 212,
    "heracross"   => 214,
    "houndoom"    => 229,
    "tyranitar"   => 248,
    "sceptile"    => 254,
    "blaziken"    => 257,
    "swampert"    => 260,
    "gardevoir"   => 282,
    "sableye"     => 302,
    "mawile"      => 303,
    "aggron"      => 306,
    "medicham"    => 308,
    "manectric"   => 310,
    "sharpedo"    => 319,
    "camerupt"    => 323,
    "altaria"     => 334,
    "banette"     => 354,
    "absol"       => 359,
    "garchomp"    => 445,
    "lucario"     => 448,
    "abomasnow"   => 460,
    "gallade"     => 475,
    "audino"      => 531,
    "diancie"     => 719
];


function adaptaNombreEspecial($nombre, $id) {
    global $mega_pokemon;
    $forma = "f00";
    $plantilla = "https://resource.pokemon-home.com/battledata/img/pokei128/icon{$id}_{$forma}_s0.png";
    if (!str_contains($nombre, "-mega") && !str_contains($nombre, "-gmax")){
        return $plantilla;
    }
    else{
        $forma = "f01";
        $id = $mega_pokemon[$nombre];
        $plantilla = "https://resource.pokemon-home.com/battledata/img/pokei128/icon000{$id}_{$forma}_s0.png";
        return $plantilla;
    }


}


?>
