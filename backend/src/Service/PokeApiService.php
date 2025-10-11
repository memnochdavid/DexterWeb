<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class PokeApiService
{
    private HttpClientInterface $client;
    private CacheInterface $cache;

    public function __construct(HttpClientInterface $client, CacheInterface $cache)
    {
        $this->client = $client;
        $this->cache = $cache;
    }

    private function fetch(string $url): array
    {
        return $this->cache->get(md5($url), function (ItemInterface $item) use ($url) {
            $item->expiresAfter(3600); // cache 1 hora
            $response = $this->client->request('GET', $url);
            return $response->toArray();
        });
    }

    public function getPokemon(string $nameOrId, string $lang = 'en'): array
    {
        $pokemon = $this->fetch("https://pokeapi.co/api/v2/pokemon/{$nameOrId}");
        $species = $this->fetch($pokemon['species']['url']);

        // Evolución completa
        $evolutionChainData = $this->fetch($species['evolution_chain']['url']);
        $evolutions = $this->parseEvolutionChain($evolutionChainData['chain']);

        // Detalles de habilidades traducidos
        $abilities = [];
        foreach ($pokemon['abilities'] as $abilityInfo) {
            $abilityData = $this->fetch($abilityInfo['ability']['url']);
            $abilities[] = [
                'name' => $this->getNameInLanguage($abilityData['names'], $lang),
                'effect' => $this->getEffectInLanguage($abilityData['effect_entries'], $lang),
            ];
        }

        // Tipos (opcional: se puede traducir con $type['names'])
        $types = [];
        foreach ($pokemon['types'] as $typeInfo) {
            $typeData = $this->fetch($typeInfo['type']['url']);
            $types[] = [
                'name' => $this->getNameInLanguage($typeData['names'], $lang)
            ];
        }
        $idPadded = str_pad($pokemon['id'], 4, '0', STR_PAD_LEFT);
        $images = [
            // 'front_default' => $pokemon['sprites']['front_default'] ?? null,  // imagen frontal normal
            // 'front_shiny' => $pokemon['sprites']['front_shiny'] ?? null,      // versión shiny
            'thumbnail' => "https://resource.pokemon-home.com/battledata/img/pokei128/icon{$idPadded}_f00_s0.png",
            'official_artwork' => "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{$pokemon['id']}.png"
        ];

        return [
            'id' => $pokemon['id'],
            'name' => $pokemon['name'],
            'stats' => $pokemon['stats'],
            'types' => $types,
            'abilities' => $abilities,
            'description' => $this->getFlavorTextInLanguage($species['flavor_text_entries'], $lang),
            'habitat' => $species['habitat']['name'] ?? null,
            'color' => $species['color']['name'] ?? null,
            'evolutions' => $evolutions,
            'images' => $images
        ];
    }

    private function parseEvolutionChain(array $chain): array
    {
        $result = [
            'name' => $chain['species']['name'],
            'evolves_to' => []
        ];

        foreach ($chain['evolves_to'] as $evolution) {
            $result['evolves_to'][] = $this->parseEvolutionChain($evolution);
        }

        return $result;
    }


    private function getFlavorTextInLanguage(array $entries, string $lang): string
    {
        foreach ($entries as $entry) {
            if ($entry['language']['name'] === $lang) {
                return str_replace("\n", " ", $entry['flavor_text']);
            }
        }
        return ''; // fallback si no hay traducción
    }

    private function getEffectInLanguage(array $entries, string $lang): string
    {
        foreach ($entries as $entry) {
            if ($entry['language']['name'] === $lang) {
                return str_replace("\n", " ", $entry['effect']);
            }
        }
        return '';
    }

    private function getNameInLanguage(array $entries, string $lang): string
    {
        foreach ($entries as $entry) {
            if ($entry['language']['name'] === $lang) {
                return $entry['name'];
            }
        }
        return $entries[0]['name'] ?? ''; // fallback
    }
}
