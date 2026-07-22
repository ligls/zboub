# Formulaire de qualification — TELUS Business Connect (BConn)

Formulaire web interactif (7 étapes, style questionnaire TELUS officiel : cartes
cliquables et compteurs) que vous envoyez à vos clients pour qualifier leurs besoins
en téléphonie VoIP. À la fin, le client télécharge un **rapport de qualification
complet** (PDF, JSON ou texte). Vous chargez ensuite ce rapport dans **votre outil
conseiller** (`rapport.html`) pour obtenir un tableau de bord structuré.

## Contenu du dossier

| Fichier        | Rôle |
|----------------|------|
| `index.html`   | Le formulaire client (moteur d'affichage). **Vous n'avez jamais besoin d'y toucher.** |
| `config.js`    | **Toutes les données** : questions, logique conditionnelle, règles de recommandation, notes de vente, équipements, prix. C'est le seul fichier à modifier. |
| `rapport.html` | **Votre outil conseiller** : glissez-y le fichier JSON exporté par le client → tableau de bord complet (recommandation, licences, checklist de notes et d'équipements, toutes les réponses), imprimable. |
| `README.md`    | Ce guide. |

## Flux de travail

1. Envoyez le lien du formulaire au client (Netlify) ou le fichier `index.html`.
2. Le client répond (~4-6 minutes, brouillon sauvegardé automatiquement) puis
   télécharge/vous envoie son rapport — ou il vous parvient par Formspree.
3. Ouvrez `rapport.html`, déposez-y le fichier `.json` reçu : vous obtenez le
   dossier client structuré avec cases à cocher pour préparer la proposition.

## Les 7 étapes du formulaire

1. **Numéros de téléphone** — numéro principal, sans frais (transfert/nouveau), autres numéros à porter ou à créer
2. **Situation actuelle** — fournisseur, système, engagement (date + coût), services TELUS, vitesse Internet
3. **Lignes** *(compteurs)* — lignes individuelles + partagées (= licences), **extensions simples** (poste sans boîte vocale ni mise en garde) et lignes publiques (alarme/ascenseur, déclenche l'avertissement)
4. **Communication** *(cartes)* — RVI, file d'attente, enregistrement, vidéo, conférences audio, présence, SMS, supervision — ou « Sauter »
5. **Fonctionnement** *(cartes)* — multisite, M365/Google, interphone, CRM, télécopie (numérique/traditionnelle), collaboration, analytics, conformité, API
6. **Téléphones** *(cartes)* — bureau, sans fil, réceptionniste, conférence, applications seulement, appareils existants
7. **Coordonnées**

## Modifier les questions (`config.js`)

Ouvrez `config.js` dans n'importe quel éditeur de texte. La structure :

```
sections → liste des étapes du formulaire
  └── questions → liste des questions de la section
```

### Types de questions disponibles

| Type       | Affichage |
|------------|-----------|
| `cards`    | Cartes cliquables (style TELUS). `multi: true` = choix multiples; `"exclusive": "skip"` rend une carte exclusive (ex. « Sauter »). Chaque option : `label` (phrase), `tag` (nom de la fonctionnalité, souligné), `description`, `icon` (emoji). |
| `counters` | Cartes à compteur −/+. Chaque item : `label`, `description`, `icon`, et `"licence": true` (compte dans les licences) ou `"extension": true` (compte dans les extensions). `requireMin` impose un minimum sur certains champs. |
| `yesno`    | Boutons Oui / Non |
| `radio`    | Choix unique (nécessite `options`) |
| `checkbox` | Choix multiples (nécessite `options`; `exclusive` possible) |
| `text` / `tel` / `email` | Champ texte |
| `number`   | Nombre (option `min`) |
| `currency` | Montant en $ / mois |
| `date`     | Sélecteur de date |
| `textarea` | Texte multiligne |
| `alert`    | Message d'information conditionnel (`"style": "warning"` ou `"info"`, texte dans `text`) |

### Logique conditionnelle (`showIf`)

Une question (ou une alerte) ne s'affiche que si sa condition est vraie :

```js
"showIf": { "q": "sit_engagement", "equals": "oui" }        // réponse exacte
"showIf": { "q": "fonc", "includes": "fax" }                // carte/case sélectionnée
"showIf": { "q": "tels", "includesAny": ["a", "b"] }        // au moins une
"showIf": { "q": "lignes", "field": "pub", "gt": 0 }        // compteur > 0
"showIf": { "all": [ {...}, {...} ] }                       // toutes à la fois
```

Si la question parente est masquée, la sous-question l'est aussi automatiquement,
et sa réponse est exclue du rapport.

### Règles de recommandation (`recommendationRules`)

Chaque règle fixe un **niveau minimum de forfait** quand une condition est vraie.
Le niveau recommandé est le plus élevé de toutes les règles déclenchées :

```js
{ "when": { "q": "comm", "includes": "rec" }, "tier": "enhanced",
  "reason": "Enregistrement des appels" }
```

Les niveaux (`tiers`) sont ordonnés du plus bas au plus haut :
`mobile` → `voice` → `voiceplus` → `enhanced` → `complete` → `completeplus`.

### Notes de vente et équipements

- `salesNoteRules` : points clés ajoutés à « Notes pour la proposition » du rapport.
- `equipmentRules` : items ajoutés à « Équipements à prévoir ».
- Dans les textes, `{fonc_crm}` est remplacé par la réponse, et `{lignes.pub}`
  par le champ `pub` de la question à compteurs `lignes`.

### Prix (optionnel)

Dans `pricing`, mettez `"enabled": true` et renseignez le prix mensuel par licence de
chaque niveau. Le rapport affichera alors une estimation budgétaire
(licences × prix du niveau recommandé). Laissez `enabled: false` pour ne montrer
aucun prix (vous faites votre devis séparément).

### Masquer la recommandation au client (optionnel)

Dans `app`, mettez `"showRecommendationToClient": false` pour que l'écran final du
client ne montre ni le niveau recommandé ni les notes de vente. Le rapport
téléchargeable et votre outil `rapport.html` restent complets.

## Recevoir les rapports par courriel (Formspree, gratuit)

1. Créez un compte sur [formspree.io](https://formspree.io) et créez un formulaire.
2. Copiez l'URL du endpoint (ex. `https://formspree.io/f/abcdwxyz`).
3. Dans `config.js`, collez-la dans `app.formspreeEndpoint` :
   ```js
   "formspreeEndpoint": "https://formspree.io/f/abcdwxyz"
   ```
4. À chaque soumission, le rapport complet (JSON) vous est envoyé automatiquement —
   copiez-le dans `rapport.html` pour l'analyser. Si l'envoi échoue, le client est
   invité à télécharger le rapport et à vous l'envoyer par courriel.

## Déployer sur Netlify (lien à envoyer aux clients)

1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glissez-déposez **le dossier complet** (`index.html` + `config.js` + `rapport.html`).
3. Netlify vous donne un lien du type `https://votre-site.netlify.app` — envoyez-le
   à vos clients. Votre outil conseiller sera à `…/rapport.html` (gardez ce lien
   pour vous).
4. Pour mettre à jour les questions : modifiez `config.js` et re-déposez le dossier.

## Télécharger les rapports (côté client)

À la fin du questionnaire, trois boutons :

- **🖨️ Télécharger le rapport (PDF)** — impression du navigateur → « Enregistrer au
  format PDF ». Contient profil, recommandation justifiée, notes, équipements et
  toutes les réponses.
- **⬇️ Exporter en JSON** — le fichier à charger dans `rapport.html`.
- **⬇️ Exporter en texte** — version à coller dans un courriel ou CRM.
