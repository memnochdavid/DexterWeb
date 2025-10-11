<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PokemonController extends AbstractController
{
    #[Route('/api/pokemon/{name}', name: 'api_pokemon_get', methods: ['GET'])]
    public function getPokemon(string $name, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'en');

        // 1. Obtener datos principales del Pokémon
        $pokemonData = @file_get_contents("https://pokeapi.co/api/v2/pokemon/{$name}");
        if (!$pokemonData) {
            return $this->json(['error' => 'Pokémon no encontrado'], 404);
        }
        $pokemon = json_decode($pokemonData, true);

        // 2. Obtener datos de la especie (para nombres en distintos idiomas)
        $speciesData = @file_get_contents($pokemon['species']['url']);
        $species = json_decode($speciesData, true);

        // Nombre traducido
        $nombre = $name; // fallback
        foreach ($species['names'] as $nameEntry) {
            if ($nameEntry['language']['name'] === $lang) {
                $nombre = $nameEntry['name'];
                break;
            }
        }

        // Tipos
        $tipos = [];
        foreach ($pokemon['types'] as $typeEntry) {
            $tipos[] = $typeEntry['type']['name'];
        }

        // Habilidades
        $habilidades = [];
        foreach ($pokemon['abilities'] as $abilityEntry) {
            // buscar traducción en la habilidad
            $abilityData = @file_get_contents($abilityEntry['ability']['url']);
            $ability = json_decode($abilityData, true);

            $abilityName = $abilityEntry['ability']['name']; // fallback
            foreach ($ability['names'] as $nameEntry) {
                if ($nameEntry['language']['name'] === $lang) {
                    $abilityName = $nameEntry['name'];
                    break;
                }
            }
            $habilidades[] = $abilityName;
        }

        // Imagen oficial
        $imagen = $pokemon['sprites']['other']['official-artwork']['front_default'] ?? null;

        // Miniatura según patrón que diste
        $idPadded = str_pad($pokemon['id'], 4, '0', STR_PAD_LEFT);
        $miniatura = "https://resource.pokemon-home.com/battledata/img/pokei128/icon{$idPadded}_f00_s0.png";

        return $this->json([
            'id' => $pokemon['id'],
            'nombre' => $nombre,
            'tipos' => $tipos,
            'habilidades' => $habilidades,
            'imagen' => $imagen,
            'miniatura' => $miniatura
        ]);
    }
}
