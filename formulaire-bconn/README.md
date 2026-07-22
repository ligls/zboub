# Formulaire de qualification — TELUS Business Connect (BConn)

Formulaire web interactif multi-étapes que vous envoyez à vos clients pour qualifier
leurs besoins en téléphonie VoIP. À la fin, le client (ou vous) télécharge un
**rapport de qualification complet** (PDF, JSON ou texte) : c'est votre dossier client
pour bâtir la proposition TELUS avec les prix.

## Contenu du dossier

| Fichier      | Rôle |
|--------------|------|
| `index.html` | Le formulaire (moteur d'affichage). **Vous n'avez jamais besoin d'y toucher.** |
| `config.js`  | **Toutes les données** : questions, logique conditionnelle, règles de recommandation, notes de vente, équipements, prix. C'est le seul fichier à modifier. |
| `README.md`  | Ce guide. |

## Démarrage rapide

Aucun serveur requis : double-cliquez sur `index.html` pour l'ouvrir dans un navigateur.
Les deux fichiers (`index.html` et `config.js`) doivent rester **dans le même dossier**.

Le brouillon du client est sauvegardé automatiquement dans son navigateur
(localStorage) — il peut fermer la page et reprendre plus tard.

## Modifier les questions (`config.js`)

Ouvrez `config.js` dans n'importe quel éditeur de texte. La structure :

```
sections → liste des étapes du formulaire
  └── questions → liste des questions de la section
```

Chaque question ressemble à ceci :

```js
{
  "id": "q13",                        // identifiant unique (ne pas dupliquer)
  "type": "yesno",                    // type de question (voir tableau ci-dessous)
  "required": true,                   // réponse obligatoire?
  "label": "Avez-vous besoin de l'enregistrement des appels?",
  "help": "Texte d'aide optionnel",   // optionnel
  "placeholder": "Ex. : 250",         // optionnel (champs texte/nombre)
  "showIf": { "q": "q6", "equals": "oui" }   // logique conditionnelle (optionnel)
}
```

### Types de questions disponibles

| Type       | Affichage |
|------------|-----------|
| `yesno`    | Boutons Oui / Non |
| `radio`    | Choix unique (nécessite `options`) |
| `checkbox` | Choix multiples (nécessite `options`; `"exclusive": "valeur"` rend une option exclusive, ex. « Aucun ») |
| `select`   | Menu déroulant (nécessite `options`) |
| `text` / `tel` / `email` | Champ texte |
| `number`   | Nombre (option `min`) |
| `currency` | Montant en $ / mois |
| `date`     | Sélecteur de date |
| `textarea` | Texte multiligne |
| `alert`    | Message d'information conditionnel (pas une question; `"style": "warning"` ou `"info"`, texte dans `text`) |

### Logique conditionnelle (`showIf`)

Une question (ou une alerte) ne s'affiche que si sa condition est vraie :

```js
"showIf": { "q": "q2", "equals": "oui" }                    // réponse exacte
"showIf": { "q": "q11", "includes": "combines" }            // case cochée (checkbox)
"showIf": { "q": "q11", "includesAny": ["a", "b"] }         // au moins une de ces cases
"showIf": { "q": "q29", "includesOtherThan": "aucune" }     // autre chose que « aucune »
"showIf": { "all": [ {...}, {...} ] }                       // toutes les conditions à la fois
```

Si la question parente est masquée, la sous-question l'est aussi automatiquement,
et sa réponse est exclue du rapport.

### Règles de recommandation (`recommendationRules`)

Chaque règle fixe un **niveau minimum de forfait** quand une condition est vraie.
Le niveau recommandé est le plus élevé de toutes les règles déclenchées :

```js
{ "when": { "q": "q13", "equals": "oui" }, "tier": "enhanced",
  "reason": "Enregistrement des appels" }
```

Les niveaux (`tiers`) sont ordonnés du plus bas au plus haut :
`mobile` → `voice` → `voiceplus` → `enhanced` → `complete` → `completeplus`.

### Notes de vente et équipements

- `salesNoteRules` : points clés ajoutés à la section « Notes pour la vente » du rapport.
- `equipmentRules` : items ajoutés à « Équipements à prévoir ».
- Dans les textes, `{q10}` est remplacé par la réponse à la question `q10`.

### Prix (optionnel)

Dans `pricing`, mettez `"enabled": true` et renseignez le prix mensuel par licence de
chaque niveau. Le rapport affichera alors une estimation budgétaire
(licences × prix du niveau recommandé). Laissez `enabled: false` pour ne montrer
aucun prix (vous faites votre devis séparément).

### Masquer la recommandation au client (optionnel)

Dans `app`, mettez `"showRecommendationToClient": false` pour que l'écran final du
client ne montre ni le niveau recommandé ni les notes de vente. Le rapport
téléchargeable (PDF/JSON/texte) reste complet.

## Recevoir les rapports par courriel (Formspree, gratuit)

1. Créez un compte sur [formspree.io](https://formspree.io) et créez un formulaire.
2. Copiez l'URL du endpoint (ex. `https://formspree.io/f/abcdwxyz`).
3. Dans `config.js`, collez-la dans `app.formspreeEndpoint` :
   ```js
   "formspreeEndpoint": "https://formspree.io/f/abcdwxyz"
   ```
4. À chaque soumission, le rapport complet (JSON) vous est envoyé automatiquement.
   Si l'envoi échoue, le client est invité à télécharger le rapport et à vous
   l'envoyer par courriel.

## Déployer sur Netlify (lien à envoyer aux clients)

1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glissez-déposez **le dossier complet** (`index.html` + `config.js`).
3. Netlify vous donne un lien du type `https://votre-site.netlify.app` — c'est ce
   lien que vous envoyez à vos clients.
4. Pour mettre à jour les questions : modifiez `config.js` et re-déposez le dossier.

## Télécharger les rapports

À la fin du questionnaire, trois boutons :

- **🖨️ Télécharger le rapport (PDF)** — ouvre l'impression du navigateur; choisissez
  « Enregistrer au format PDF ». Le rapport imprimé contient : profil client,
  recommandation avec justifications, notes pour la vente, équipements, et toutes
  les réponses.
- **⬇️ Exporter en JSON** — données structurées (utile pour vos outils).
- **⬇️ Exporter en texte** — version texte simple à coller dans un courriel ou CRM.
