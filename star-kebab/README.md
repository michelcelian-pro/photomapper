# Star Kebab — Le Thor 🌯

Site vitrine (4 pages + 404) pour le Star Kebab au Thor (Vaucluse, 84).
**Objectif : donner faim et envoyer commander sur Uber Eats.** Aucun prix, aucun menu — la carte vit sur Uber Eats.

- HTML / CSS / JS **vanilla**, TailwindCSS via CDN — **aucun build**, déployable tel quel.
- Mobile-first, mode jour/nuit, statut ouvert/fermé en direct, animations au scroll, etc.

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil (hero, signatures, teaser histoire, avis, marquee) |
| `specialites.html` | Galerie immersive des spécialités (pas un menu) |
| `histoire.html` | Récit éditorial, timeline, valeurs, équipe |
| `contact.html` | Carte, adresse, horaires, itinéraire, formulaire mailto |
| `404.html` | Page d'erreur personnalisée |
| `assets/css/styles.css` | Styles maison (thème, animations, ticket…) |
| `assets/js/config.js` | Configuration Tailwind (couleurs, polices) |
| `assets/js/main.js` | Toute la logique (horaires, thème, animations…) |

## 1) Remplacer les placeholders

Faites un **rechercher / remplacer dans tous les fichiers** pour ces valeurs :

| Placeholder | À remplacer par | Où |
|---|---|---|
| `[LIEN_UBER_EATS]` | URL de votre page Uber Eats | tous les fichiers (tous les CTA) |
| `[ADRESSE]` | Adresse complète | `contact.html`, footers, carte |
| `[TELEPHONE]` | N° de téléphone (ex. `+33 4 90 ...`) | `contact.html`, footers |
| `[EMAIL]` | E-mail de contact | `contact.html` (formulaire) |
| `[INSTAGRAM]` `[FACEBOOK]` `[TIKTOK]` | URLs réseaux sociaux | footers, `contact.html` |

> 💡 La carte et l'itinéraire dans `contact.html` pointent par défaut sur « Le Thor ».
> Remplacez `Le+Thor,+Vaucluse,+France` (dans l'`iframe` et le lien *Itinéraire*) par votre adresse exacte.

## 2) Modifier les horaires

Tout est dans **un seul objet** en haut de `assets/js/main.js` (constante `HORAIRES`).
Le statut « Ouvert/Fermé », le compte à rebours avant fermeture et le tableau d'horaires
de la page Contact en découlent automatiquement.

```js
const HORAIRES = {
  // 0 = Dimanche, 1 = Lundi, … 6 = Samedi
  1: [["11:00", "14:30"], ["18:00", "23:00"]], // Lundi : midi + soir
  6: [["11:00", "23:30"]],                       // Samedi : service continu
  // jour fermé -> tableau vide :  3: [],
};
```

## 3) Remplacer les photos

Les images utilisent des URLs **Unsplash** (mots-clés kebab, durum, frites…).
Si une image ne se charge pas, une photo de repli (LoremFlickr) puis une tuile
de marque s'affichent automatiquement — jamais d'image cassée.
Pour vos vraies photos, remplacez l'attribut `src` des balises `<img>`.

## 4) Déployer sur GitHub Pages

Ce site est dans le sous-dossier `star-kebab/`.

- **Option A — publier ce dossier :** réglez *Settings → Pages → Source* sur la branche
  voulue et le dossier `/star-kebab` (si proposé), ou déplacez le contenu de `star-kebab/`
  à la racine de la branche publiée. Le site sera servi à `…/<repo>/` ou `…/<repo>/star-kebab/`.
- **Option B — dépôt dédié :** copiez le contenu de `star-kebab/` à la racine d'un dépôt,
  puis activez Pages sur `main` / dossier `/ (root)`.

> ⚠️ **Page 404 :** GitHub Pages n'utilise automatiquement que le `404.html` placé **à la racine
> du site publié**. Si le site est servi depuis la racine, `404.html` fonctionne tel quel ;
> s'il est servi depuis un sous-dossier, déplacez `404.html` à la racine pour qu'il soit pris en compte.

## Fonctionnalités

Statut ouvert/fermé live · compte à rebours avant fermeture · CTA Uber Eats sticky (barre fixe mobile) ·
reveal au scroll + parallax · curseur custom desktop · thème jour/nuit · easter egg d'inactivité (accueil) ·
bandeau saisonnier dismissible · marquee · respect de `prefers-reduced-motion`.
