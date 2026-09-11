PEEPZ — INSTALLATION
====================

1. CRÉER LE PROJET SUPABASE
- Crée un nouveau projet Supabase nommé PEEPZ.
- Dans SQL Editor, ouvre un nouvel onglet.
- Copie/colle tout le contenu de supabase-peepz.sql puis Run.
- Le script crée : profiles, projects, likes, comments + les règles RLS.

2. AUTHENTIFICATION
- Dans Authentication > Providers, laisse Email activé.
- Pour les premiers tests, tu peux désactiver temporairement la confirmation e-mail.
- En production, réactive-la si tu veux valider les adresses.

3. RÉCUPÉRER LES CLÉS
Dans les réglages API du projet Supabase, récupère :
- Project URL
- clé publishable / anon

4. LES METTRE DANS index.html
Cherche :
  const SUPABASE_URL = "YOUR_PEEPZ_SUPABASE_URL";
  const SUPABASE_KEY = "YOUR_PEEPZ_SUPABASE_ANON_KEY";

Remplace uniquement le contenu entre guillemets par les valeurs de ton projet PEEPZ.

5. PUBLIER SUR GITHUB PAGES
Place à la racine du dépôt :
- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png

6. FONCTIONNEMENT
- Un compte est nécessaire pour accéder au flux.
- Chaque compte choisit une signature publique unique.
- Un clic sur le logo PEEPZ ouvre l'espace personnel.
- Dans cet espace : publier un projet / modifier ses projets.
- Tous les membres connectés voient les projets publiés par les autres.
- Swipe vers le haut : Archives.
- Swipe vers le bas : Ma sélection.
- Likes et commentaires sont partagés via Supabase.
- La signature du compte est utilisée comme identité publique pour les projets et commentaires.

COULEURS
- Accent startup : violet électrique #6558F5
- Second accent : cyan #17B6C8
