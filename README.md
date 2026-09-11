# PASS — PWA corrigée

Cette version corrige les deux problèmes visibles dans le test précédent.

## Carte à nouveau libre

Le bug venait du verrouillage d'un appartement : le code recentrait la carte à chaque événement `move`, ce qui empêchait tout déplacement.

Désormais :
- la carte se déplace normalement à la souris et au doigt ;
- un clic sur un appartement le fait glisser au centre sans modifier le niveau de zoom ;
- l'appartement est ensuite verrouillé au centre uniquement pour les opérations de zoom ;
- un nouveau déplacement volontaire de la carte libère immédiatement ce verrouillage.

## Trajets recalculés

Pendant le déplacement :
- les lignes temporaires restent toujours reliées exactement au point central ;
- les anciens itinéraires routés sont retirés lorsqu'ils deviennent obsolètes.

Après une courte pause — et systématiquement à la fin d'un déplacement :
- PASS recalcule les itinéraires depuis la nouvelle position centrale ;
- le mode propre à chaque lieu est respecté : À pied / Vélo / Voiture ;
- les trajets utilisent le réseau OpenStreetMap via Valhalla ;
- la géométrie est contrôlée avant affichage ;
- chaque itinéraire est forcé à toucher exactement le centre et son point d'intérêt ;
- une petite étiquette indique le lieu et la durée ;
- un clic sur l'itinéraire ouvre la distance et la durée.

Le prototype utilise :
`https://valhalla.openstreetmap.de/route`

En production, il faudra utiliser une instance Valhalla dédiée ou un service de routage avec garanties de disponibilité.

## Capture d'un logement

- approche du point central : capture automatique + flash/clic ;
- clic direct sur un logement : glissement au centre sans zoom automatique ;
- Ignorer / Intéressé / Je candidate restent disponibles.

## Important pour GitHub Pages

Le service worker est maintenant en stratégie `network first` et son cache a changé de version. Cela évite que Safari ou Chrome continue d'utiliser un ancien `app.js` après le remplacement des fichiers.

Après avoir remplacé les fichiers sur GitHub, recharge une fois la page.
