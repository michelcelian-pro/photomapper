# Star Kebab — Le Thor 🌯

Site vitrine **une seule page** pour le Star Kebab au Thor (Vaucluse, 84).
**Objectif : montrer ce qu'est le Star Kebab et envoyer commander sur Uber Eats** (à emporter ou en livraison). Aucun prix : la carte vit sur Uber Eats.

- HTML / CSS / JS **vanilla**, TailwindCSS via CDN — **aucun build**, déployable tel quel.
- Mobile-first, statut ouvert/fermé en direct, animations au scroll.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page unique (hero, photos, boutons commander, infos pratiques) |
| `404.html` | Page d'erreur personnalisée |
| `assets/css/styles.css` | Styles maison |
| `assets/js/config.js` | Configuration Tailwind (couleurs, polices) |
| `assets/js/main.js` | Logique (horaires + statut, animations) |

## Modifier les infos importantes

**Lien Uber Eats** — il apparaît dans `index.html` et `404.html` (boutons « À emporter » et « Livraison »).
Pour le changer partout : rechercher/remplacer l'URL `https://www.ubereats.com/fr/store/star-kebab-le-thor/...`.

**Adresse / téléphone** — directement dans `index.html` (section « Nous trouver » + pied de page).
La carte et l'itinéraire pointent sur `271 Rue de la Gare, 84250 Le Thor`.

**Horaires** — dans **un seul objet** en haut de `assets/js/main.js` (constante `HORAIRES`).
Le statut « Ouvert/Fermé » et le tableau des horaires en découlent automatiquement.

```js
const HORAIRES = {
  // 0 = Dimanche, 1 = Lundi, … 6 = Samedi
  1: [["11:00", "14:00"], ["18:00", "22:00"]], // Lundi : midi + soir
  0: [["18:00", "22:00"]],                       // Dimanche : soir uniquement
  // jour fermé -> tableau vide :  3: [],
};
```

**Photos** — URLs Unsplash (avec repli automatique si une image ne charge pas).
Remplacez l'attribut `src` des balises `<img>` par vos vraies photos.

## Mettre en ligne

Site statique : déployable tel quel sur **Vercel** (dossier racine `star-kebab`) ou **GitHub Pages**.
Aucune étape de build.
