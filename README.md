# PASS — PWA complète

Cette archive contient la version fonctionnelle demandée de PASS.

## Fichiers

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`

## Fonctionnalités intégrées

- Carte principale plein écran de La Rochelle.
- Filtres logement : loyer, surface, type, meublé, équipements.
- Repères personnels fixes : importance + mode À pied / Vélo / Voiture.
- Appartements dessinés directement dans une couche géographique MapLibre : ils restent parfaitement ancrés au plan.
- Clic sur un appartement : recentrage SANS changement de zoom.
- Une fois sélectionné, l'appartement reste verrouillé exactement sous le viseur central pendant les zooms.
- Dès que l'utilisateur recommence à déplacer volontairement la carte, le verrouillage est libéré.
- Capture de proximité avec flash bref + clic d'obturateur synthétique + vibration compatible.
- Trois états : Ignorer / Intéressé / Je candidate.
- `Je candidate` simule la notification automatique du propriétaire.
- Branches droites très légères pendant le déplacement.
- À l'arrêt, tentative de calcul des vrais trajets via Valhalla (OpenStreetMap), pour À pied / Vélo / Voiture.
- Clic sur un trajet réel : distance + durée.
- PWA installable et responsive.

## Routage

Le prototype utilise le serveur de démonstration public Valhalla :
`https://valhalla1.openstreetmap.de/route`

Le serveur est soumis à une politique de fair use. Pour une application en production, il faudra utiliser une instance Valhalla propre ou un fournisseur de routage dédié.

Si le serveur de routage ne répond pas, l'application conserve les lignes droites et le reste de l'interface continue de fonctionner.

## Lancer localement

Dans ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvrir :

`http://localhost:8080`

Pour l'installation PWA sur téléphone, utiliser un hébergement HTTPS (GitHub Pages convient pour le prototype).
