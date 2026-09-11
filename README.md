# PASS — Prototype cartographique V2

La carte de La Rochelle est désormais l'écran principal.

## Ce qui est intégré
- Filtres logement : loyer maximum, surface minimum, type, meublé, équipements.
- Filtres de vie : lycée, travail/stage, cinéma, gare, Vieux-Port, courses, sport, plage, plus lieux personnels.
- Branches dynamiques et score de compatibilité pendant le déplacement.
- Logements visibles directement sur la carte.
- Capture automatique d'un logement quand le repère central s'en approche.
- Fiche contextuelle avec 3 actions :
  - Ignorer : le logement disparaît.
  - Intéressé : ajout aux visites potentielles sans prévenir le propriétaire.
  - Je candidate : simulation d'une candidature et notification automatique du propriétaire.
- Responsive :
  - desktop : carte plein écran + filtres flottants + fiche logement à droite ;
  - mobile : carte plein écran + panneau filtres inférieur + fiche logement en bas.
- PWA installable.

## Lancer
Dans le dossier :
`python3 -m http.server 8080`

Puis ouvrir :
`http://localhost:8080`

Les logements sont fictifs. Le fond de carte utilise MapLibre GL JS et OpenFreeMap.
