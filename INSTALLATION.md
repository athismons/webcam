# Lecteur de la webcam municipale

Ce dépôt contient uniquement le lecteur public. La vidéo provient de YouTube, jamais de GitHub Pages. Aucun identifiant caméra, clé YouTube ou jeton ne doit être déposé ici.

1. Déposer index.html, style.css, lecteur.js, active.json et .nojekyll à la racine de la branche main.
2. Créer une branche status à partir de main. L’iMac modifiera uniquement active.json sur cette branche. Il n’y aura donc pas de reconstruction Pages à chaque mise à jour.
3. Settings > Pages : Deploy from a branch, branche main, dossier / (root), puis Save.
4. Adresse du lecteur : https://athismons.github.io/webcam/
5. Tester cette adresse avant de remplacer l’iframe WordPress. Elle doit initialement annoncer l’indisponibilité du direct.

## Mise à jour automatique depuis l’iMac

Créer un jeton GitHub à permissions fines appartenant à un compte habilité sur ce dépôt. Sélectionner seulement athismons/webcam, permission Contents : Read and write. Aucun droit sur Workflows, administration ou les autres dépôts n’est requis. Choisir une expiration compatible avec l’exploitation et prévoir son renouvellement ; un jeton expiré ou révoqué interrompt les mises à jour. Ne jamais enregistrer le jeton dans ce dépôt ou dans le navigateur du lecteur.

Sur l’iMac : lancer ~/webcam-youtube/.venv/bin/python ~/webcam-youtube/service-webcam.py configure-github, puis saisir le jeton à l’invite masquée. Il reste dans secrets/github.json avec permissions 600. La connexion doit être validée par une publication d’état avant le service permanent.

Le fichier est actualisé lors des changements et au plus toutes les dix minutes pour confirmer l’état. Le lecteur le relit toutes les trente secondes. Les caches GitHub peuvent ajouter un délai : le remplacement n’est pas instantané. Sans état public frais depuis trente minutes, le lecteur affiche une indisponibilité. Les identifiants des essais privés ne sont jamais publiés.

Le bouton Afficher le direct YouTube évite de charger le lecteur Google avant une action du visiteur. Les requêtes de recherche d’état contactent GitHub dès le chargement de la page ; cette utilisation de GitHub et celle de YouTube doivent être décrites dans les informations du site. Vérifier l’intégration avec le gestionnaire de consentement municipal avant publication définitive.

## Bloc HTML pour WordPress

```html
<iframe
  src="https://athismons.github.io/webcam/"
  title="Webcam en direct — Ville d’Athis-Mons"
  width="960" height="540"
  style="width:100%;aspect-ratio:16/9;height:auto;border:0"
  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen>
</iframe>
```

Cette adresse reste identique lorsque l’identifiant YouTube change. Tester qu’un nouveau direct public remplace l’ancien sur une page déjà ouverte ; un essai privé doit continuer à apparaître indisponible au public.
