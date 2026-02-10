# City Insights

Développé par Zied RJEB

City Insights est une application web moderne qui centralise des données temps réel (météo, transports, pollution, événements) pour une ville donnée. L'objectif est de démontrer la maîtrise des états asynchrones, de la résilience face aux APIs instables et d'une UX claire.

## Aperçu

- Recherche de ville avec autocomplétion
- Modules indépendants (météo, transports, pollution, événements)
- Gestion d'erreur isolée par module
- Cache intelligent et revalidation avec TanStack Query
- UI responsive, mobile-first

## Stack technique

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS
- TanStack Query

## Architecture

- `src/api/`: clients d'API + normalisation des réponses
- `src/hooks/`: hooks React Query pour isoler le data fetching
- `src/components/`: UI découplée par module
- `src/lib/queryClient.ts`: stratégie de cache et retry
- `src/data/mock.ts`: données mockables pour démo sans clés API

## Arborescence (extrait)

```
src/
  api/
    events.ts
    geocoding.ts
    pollution.ts
    transport.ts
    weather.ts
  components/
    EventsPanel.tsx
    PollutionPanel.tsx
    SearchBar.tsx
    SectionCard.tsx
    TransportPanel.tsx
    WeatherPanel.tsx
  hooks/
    useCitySearch.ts
    useEvents.ts
    usePollution.ts
    useTransport.ts
    useWeather.ts
  data/
    mock.ts
  lib/
    queryClient.ts
  types.ts
```

## APIs utilisées

- Météo: Open-Meteo (sans clé)
- Géocodage: Open-Meteo (sans clé)
- Pollution: OpenAQ (clé requise)
- Transports: transport.rest (instance spécifique, peut être remplacée)
- Événements: Ticketmaster (clé requise)

## Variables d'environnement

Copiez `.env.example` en `.env` et renseignez vos clés :

```
VITE_USE_MOCKS=false
VITE_TICKETMASTER_API_KEY=your_key_here
VITE_OPENAQ_API_KEY=your_key_here
VITE_TRANSPORT_API_BASE=/api/transport
```

## Notes dev (CORS)
OpenAQ v3 n'autorise pas les appels directs navigateur (CORS). En dev, Vite proxy `/api/openaq`
vers `https://api.openaq.org`. Redémarrez `npm run dev` après modification.

Transport REST bloque aussi le CORS sur l'instance publique. En dev, Vite proxy `/api/transport`
vers `https://v6.db.transport.rest`. Vous pouvez changer l'instance via `VITE_TRANSPORT_API_BASE`.
Cette instance a un rate limit et une couverture géographique limitée. L'app réduit les retries et
affiche un message si aucun arrêt n'est trouvé.

## Lancer le projet

```
npm install
npm run dev
```

## Points forts pour un recruteur

- Séparation claire entre state local et server-state
- Résilience aux erreurs API (module par module)
- UX réaliste : skeletons, messages d'erreurs, revalidation
- Typage strict et découpage en hooks réutilisables
- Architecture scalable (API, hooks, UI isolés)

## Exemples clés

- Gestion d'erreur API isolée : `src/components/ErrorState.tsx`
- Cache et revalidation : `src/lib/queryClient.ts`
- Hooks dédiés au data fetching : `src/hooks/`
