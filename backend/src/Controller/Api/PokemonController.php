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
        $lang = $request->query->get('lang', 'es'); // por defecto español

        // 1. Obtener datos principales del Pokémon
        $pokemonData = @file_get_contents("https://pokeapi.co/api/v2/pokemon/{$name}");
        if (!$pokemonData) {
            return $this->json(['error' => 'Pokémon no encontrado'], 404);
        }
        $pokemon = json_decode($pokemonData, true);

        // 2. Obtener datos de la especie
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

        // Descripción traducida
        $descripcion = "No hay descripción disponible";
        foreach ($species['flavor_text_entries'] as $entry) {
            if ($entry['language']['name'] === $lang) {
                $descripcion = str_replace(["\n", "\f"], " ", $entry['flavor_text']);
                break;
            }
        }

        // Tipos traducidos
        $tipos = [];
        foreach ($pokemon['types'] as $typeEntry) {
            $tipos[] = $typeEntry['type']['name']; // Podrías mejorar para traducir
        }

        // Habilidades traducidas
        $habilidades = [];
        foreach ($pokemon['abilities'] as $abilityEntry) {
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

        // Miniatura según patrón
        $idPadded = str_pad($pokemon['id'], 4, '0', STR_PAD_LEFT);
        $miniatura = "https://resource.pokemon-home.com/battledata/img/pokei128/icon{$idPadded}_f00_s0.png";

        return $this->json([
            'id' => $pokemon['id'],
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'tipos' => $tipos,
            'habilidades' => $habilidades,
            'imagen' => $imagen,
            'miniatura' => $miniatura
        ]);
    }
}
