/* ============================================================================
   CONFIGURATION DU FORMULAIRE — TELUS Business Connect (BConn)
   ============================================================================
   Ce fichier contient TOUTES les données du formulaire : questions, logique
   conditionnelle, règles de recommandation, notes de vente, équipements et
   prix. Modifiez-le librement sans toucher au code de index.html.

   Le contenu est du JSON pur assigné à window.BCONN_CONFIG (format .js pour
   que le formulaire fonctionne aussi en ouvrant index.html directement,
   sans serveur). Voir README.md pour le mode d'emploi complet.
   ============================================================================ */

window.BCONN_CONFIG = {

  "app": {
    "title": "TELUS Business Connect",
    "subtitle": "Questionnaire — Solution téléphonique d'affaires",
    "intro": "Ce questionnaire prend environ 4 à 6 minutes. Vos réponses nous permettront de préparer une proposition personnalisée pour votre entreprise. Vos réponses sont sauvegardées automatiquement dans votre navigateur.",
    "showRecommendationToClient": true,
    "formspreeEndpoint": ""
  },

  "tiers": [
    { "id": "mobile",       "label": "Mobile",              "description": "Appels et SMS via l'application mobile uniquement." },
    { "id": "voice",        "label": "Voice",               "description": "Appels de base, boîte vocale, appels locaux illimités." },
    { "id": "voiceplus",    "label": "Voice+",              "description": "Voice + présence, intégrations Office/Google, fax de base." },
    { "id": "enhanced",     "label": "Enhanced",            "description": "Voice+ + enregistrement d'appels, RVI avancé, files d'attente avancées." },
    { "id": "complete",     "label": "Complete",            "description": "Enhanced + conférences audio, vidéoconférence, intégrations CRM (Salesforce, Zendesk), chat/collaboration, analytics." },
    { "id": "completeplus", "label": "Complete Plus (BTL)", "description": "Complete + supervision des appels, hotdesking, accès API, archivage/conformité, multisite complet, files d'attente en débordement." }
  ],

  "pricing": {
    "enabled": false,
    "currencyLabel": "$ CAD / mois / licence",
    "note": "Prix indicatifs — la proposition officielle sera préparée par votre conseiller TELUS.",
    "tiers": {
      "mobile": 0,
      "voice": 0,
      "voiceplus": 0,
      "enhanced": 0,
      "complete": 0,
      "completeplus": 0
    }
  },

  "sections": [

    {
      "id": "numeros",
      "title": "Vos numéros de téléphone",
      "icon": "📞",
      "questions": [
        {
          "id": "num_principal", "type": "tel", "required": true,
          "label": "Quel est votre numéro principal d'entreprise?",
          "placeholder": "Ex. : 418 555-0123"
        },
        {
          "id": "num_sansfrais", "type": "cards", "multi": false, "required": true,
          "label": "Avez-vous besoin d'un numéro sans frais (1-800)?",
          "options": [
            { "value": "porter",  "label": "Oui — nous en avons un à transférer", "tag": "Portabilité" },
            { "value": "nouveau", "label": "Oui — nous en voulons un nouveau",    "tag": "Nouveau numéro" },
            { "value": "non",     "label": "Non" }
          ]
        },
        {
          "id": "num_autres", "type": "cards", "multi": true, "required": true, "exclusive": "aucun",
          "label": "Et vos autres numéros?",
          "help": "Choisissez tout ce qui s'applique",
          "options": [
            { "value": "porter",   "label": "Nous avons des numéros existants à transférer", "tag": "Portabilité" },
            { "value": "nouveaux", "label": "Il nous faudra de nouveaux numéros",            "tag": "Nouveaux numéros" },
            { "value": "aucun",    "label": "Aucun autre numéro" }
          ]
        },
        {
          "id": "num_autres_liste", "type": "textarea", "required": true,
          "label": "Listez les numéros à transférer (un par ligne)",
          "showIf": { "q": "num_autres", "includes": "porter" },
          "placeholder": "418 555-0001\n418 555-0002"
        },
        {
          "id": "num_autres_nb", "type": "number", "required": true, "min": 1,
          "label": "Combien de nouveaux numéros?",
          "showIf": { "q": "num_autres", "includes": "nouveaux" }
        }
      ]
    },

    {
      "id": "situation",
      "title": "Votre situation actuelle",
      "icon": "🏢",
      "questions": [
        {
          "id": "sit_fournisseur", "type": "radio", "required": true,
          "label": "Qui est votre fournisseur téléphonique actuel?",
          "options": [
            { "value": "telus",     "label": "TELUS" },
            { "value": "bell",      "label": "Bell" },
            { "value": "videotron", "label": "Vidéotron" },
            { "value": "rogers",    "label": "Rogers" },
            { "value": "autre",     "label": "Autre" },
            { "value": "aucun",     "label": "Aucun" }
          ]
        },
        {
          "id": "sit_systeme", "type": "radio", "required": true,
          "label": "Quel est votre système téléphonique actuel?",
          "options": [
            { "value": "analogique", "label": "Ligne(s) analogique(s)" },
            { "value": "pbx",        "label": "Système PBX" },
            { "value": "voip",       "label": "VoIP avec un autre fournisseur" },
            { "value": "cellulaire", "label": "Cellulaires seulement" },
            { "value": "aucun",      "label": "Aucun système" }
          ]
        },
        {
          "id": "sit_engagement", "type": "yesno", "required": true,
          "label": "Avez-vous un engagement/contrat en cours?"
        },
        {
          "id": "sit_eng_fin", "type": "date", "required": true,
          "label": "Date de fin de l'engagement",
          "showIf": { "q": "sit_engagement", "equals": "oui" }
        },
        {
          "id": "sit_eng_cout", "type": "currency", "required": true, "min": 0,
          "label": "Coût mensuel actuel (avant taxes)",
          "showIf": { "q": "sit_engagement", "equals": "oui" },
          "placeholder": "Ex. : 250"
        },
        {
          "id": "sit_services", "type": "checkbox", "required": true, "exclusive": "aucun",
          "label": "Avez-vous déjà des services TELUS?",
          "options": [
            { "value": "tsb",      "label": "Internet affaires (TSB)" },
            { "value": "mobilite", "label": "Mobilité" },
            { "value": "tele",     "label": "Télé" },
            { "value": "aucun",    "label": "Aucun" }
          ]
        },
        {
          "id": "sit_internet", "type": "radio", "required": true,
          "label": "Quelle est la vitesse de votre Internet actuel (ou vendu)?",
          "options": [
            { "value": "moins50", "label": "Moins de 50 Mbps" },
            { "value": "50a300",  "label": "50 à 300 Mbps" },
            { "value": "300a1g",  "label": "300 Mbps à 1 Gbps" },
            { "value": "1g5plus", "label": "1,5 Gbps et plus" },
            { "value": "nsp",     "label": "Je ne sais pas" }
          ]
        }
      ]
    },

    {
      "id": "lignes",
      "title": "Combien de lignes téléphoniques votre entreprise utilisera-t-elle?",
      "icon": "🔢",
      "questions": [
        {
          "id": "lignes", "type": "counters", "required": true,
          "label": "Indiquez une quantité pour chaque type qui s'applique",
          "requireMin": {
            "fields": ["ind", "part", "ext"], "total": 1,
            "message": "Indiquez au moins une ligne individuelle, partagée ou une extension."
          },
          "items": [
            { "value": "ind",  "icon": "👤", "label": "Lignes individuelles",
              "description": "Pour tout employé ayant un numéro, un poste ou une messagerie vocale distincts",
              "licence": true },
            { "value": "part", "icon": "👥", "label": "Lignes partagées",
              "description": "Pour tout téléphone partagé par des employés, comme dans une salle de conférence",
              "licence": true },
            { "value": "ext",  "icon": "🔔", "label": "Extensions simples",
              "description": "Poste sans boîte vocale ni mise en garde d'appels (entrepôt, cafétéria, etc.)",
              "extension": true },
            { "value": "pub",  "icon": "🚨", "label": "Lignes publiques",
              "description": "Requises pour les alarmes incendie, les systèmes de sécurité et les ascenseurs" }
          ]
        },
        {
          "id": "alerte_pub", "type": "alert", "style": "warning",
          "showIf": { "q": "lignes", "field": "pub", "gt": 0 },
          "text": "Les alarmes, systèmes de sécurité et ascenseurs reliés à une ligne fixe nécessitent une solution dédiée (ligne numérique ou cellulaire) — votre conseiller la prévoira dans la proposition."
        }
      ]
    },

    {
      "id": "communication",
      "title": "Comment votre entreprise doit-elle communiquer?",
      "icon": "💬",
      "questions": [
        {
          "id": "comm", "type": "cards", "multi": true, "required": true, "exclusive": "skip",
          "label": "Choisissez tout ce qui s'applique",
          "options": [
            { "value": "rvi",         "label": "Nous recevons tant d'appels qu'il nous faut un système automatisé pour y répondre", "tag": "RVI à niveaux et auto-réception" },
            { "value": "queue",       "label": "Nous devons pouvoir mettre les appels en attente pour que d'autres y répondent",    "tag": "File d'attente d'appels" },
            { "value": "rec",         "label": "Nous devons pouvoir enregistrer les appels téléphoniques",                          "tag": "Enregistrement des appels" },
            { "value": "video",       "label": "Nous devons faire des appels vidéo à distance",                                     "tag": "Vidéoconférence" },
            { "value": "audioconf",   "label": "Nous tenons des conférences audio avec des participants externes",                  "tag": "Conférences audio illimitées" },
            { "value": "presence",    "label": "Nous voulons savoir si le poste est disponible ou occupé avant de joindre un collègue", "tag": "Présence" },
            { "value": "sms",         "label": "Nous devons envoyer et recevoir des textos avec le numéro d'entreprise",            "tag": "SMS d'affaires" },
            { "value": "supervision", "label": "Des superviseurs doivent pouvoir écouter, assister ou reprendre des appels",        "tag": "Supervision et coaching" },
            { "value": "skip",        "label": "Sauter / Je ne sais pas trop" }
          ]
        },
        {
          "id": "comm_rvi_nb", "type": "number", "required": false, "min": 1,
          "label": "Environ combien de choix/menus votre accueil automatisé devrait-il offrir?",
          "showIf": { "q": "comm", "includes": "rvi" }
        }
      ]
    },

    {
      "id": "fonctionnement",
      "title": "Dites-nous en plus sur le fonctionnement de votre entreprise",
      "icon": "⚙️",
      "questions": [
        {
          "id": "fonc", "type": "cards", "multi": true, "required": true, "exclusive": "skip",
          "label": "Choisissez tout ce qui s'applique",
          "options": [
            { "value": "multisite",  "label": "Nous avons plus d'un immeuble ou d'une succursale",                                  "tag": "Gestion multisite" },
            { "value": "m365",       "label": "Nous utilisons régulièrement Microsoft 365 ou Google Workspace",                     "tag": "Intégration à M365 ou G.W." },
            { "value": "annonce",    "label": "Nous devons faire des annonces audio aux employés sur leurs appareils",              "tag": "Annonce interne et interphone" },
            { "value": "crm",        "label": "Nous utilisons un logiciel de gestion de relation client (CRM)",                     "tag": "Intégration au logiciel de CRM" },
            { "value": "fax",        "label": "Nous envoyons et recevons des télécopies",                                           "tag": "Télécopie" },
            { "value": "collab",     "label": "Nous partageons des documents et collaborons en équipe (chat, fichiers, tâches)",    "tag": "Collaboration d'équipe" },
            { "value": "analytics",  "label": "Nous voulons des rapports d'utilisation et des tableaux de bord",                    "tag": "Rapports et analyses" },
            { "value": "compliance", "label": "Nous devons conserver appels, textos ou télécopies pour audit ou conformité",        "tag": "Archivage et conformité" },
            { "value": "api",        "label": "Nous voulons développer des intégrations sur mesure",                                "tag": "Accès API" },
            { "value": "skip",       "label": "Sauter / Je ne sais pas trop" }
          ]
        },
        {
          "id": "fonc_sites_nb", "type": "number", "required": true, "min": 2,
          "label": "Combien d'emplacements?",
          "showIf": { "q": "fonc", "includes": "multisite" }
        },
        {
          "id": "fonc_crm", "type": "text", "required": true,
          "label": "Quel CRM utilisez-vous?",
          "placeholder": "Salesforce, Zendesk, HubSpot, Microsoft Dynamics…",
          "showIf": { "q": "fonc", "includes": "crm" }
        },
        {
          "id": "fax_type", "type": "cards", "multi": true, "required": true,
          "label": "De quel type de service de télécopie votre entreprise a-t-elle besoin?",
          "showIf": { "q": "fonc", "includes": "fax" },
          "options": [
            { "value": "numerique",    "label": "Télécopie numérique",
              "description": "Tous nos forfaits comprennent Fax IP, un service de télécopie en ligne convivial sans télécopieur." },
            { "value": "traditionnel", "label": "Télécopieur traditionnel",
              "description": "Si vous avez besoin d'un télécopieur traditionnel, vous aurez besoin de lignes supplémentaires et d'un adaptateur de terminal analogique pour le relier au réseau." }
          ]
        }
      ]
    },

    {
      "id": "telephones",
      "title": "De quels téléphones votre entreprise a-t-elle besoin?",
      "icon": "📱",
      "questions": [
        {
          "id": "tels", "type": "cards", "multi": true, "required": true,
          "label": "Choisissez tout ce qui s'applique",
          "options": [
            { "value": "bureau",         "icon": "☎️", "label": "Téléphones de bureau",
              "description": "Combinés IP filaires classiques" },
            { "value": "sansfil",        "icon": "📶", "label": "Téléphones de bureau sans fil",
              "description": "WiFi ou DECT — idéal sans câblage Ethernet aux postes" },
            { "value": "receptionniste", "icon": "🎛️", "label": "Téléphones de réceptionniste",
              "description": "Touches de postes (BLF) pour voir les lignes et transférer rapidement" },
            { "value": "conference",     "icon": "🔊", "label": "Téléphones conférence",
              "description": "Pour les salles de réunion" },
            { "value": "apps",           "icon": "💻", "label": "Applications seulement",
              "description": "Vos employés utiliseront l'application mobile ou de bureau" },
            { "value": "existants",      "icon": "♻️", "label": "Nous voulons utiliser des appareils que nous avons déjà" }
          ]
        },
        {
          "id": "tels_existants", "type": "text", "required": false,
          "label": "Quels appareils avez-vous déjà? (marque/modèle)",
          "showIf": { "q": "tels", "includes": "existants" }
        }
      ]
    },

    {
      "id": "contact",
      "title": "Vos coordonnées",
      "icon": "✉️",
      "questions": [
        { "id": "c_nom",        "type": "text",  "required": true, "label": "Votre nom complet" },
        { "id": "c_entreprise", "type": "text",  "required": true, "label": "Nom de l'entreprise" },
        { "id": "c_courriel",   "type": "email", "required": true, "label": "Courriel", "placeholder": "vous@entreprise.com" },
        { "id": "c_tel",        "type": "tel",   "required": true, "label": "Téléphone", "placeholder": "Ex. : 418 555-0123" },
        {
          "id": "c_moment", "type": "radio", "required": true,
          "label": "Meilleur moment pour un suivi",
          "options": [
            { "value": "matin",        "label": "Matin (8 h à 12 h)" },
            { "value": "apresmidi",    "label": "Après-midi (12 h à 17 h)" },
            { "value": "findejournee", "label": "Fin de journée (17 h à 19 h)" },
            { "value": "nimporte",     "label": "Peu importe" }
          ]
        }
      ]
    }
  ],

  /* --------------------------------------------------------------------------
     RÈGLES DE RECOMMANDATION
     Chaque règle : si la condition "when" est vraie, le niveau minimum requis
     est "tier" (id d'un niveau de la liste "tiers"). Le niveau recommandé est
     le plus élevé de toutes les règles déclenchées.
     -------------------------------------------------------------------------- */
  "recommendationRules": [
    { "when": { "q": "tels", "includesAny": ["bureau", "sansfil", "receptionniste", "conference"] }, "tier": "voice", "reason": "Combinés téléphoniques physiques" },
    { "when": { "q": "fonc", "includes": "fax" },         "tier": "voice",        "reason": "Service de télécopie" },
    { "when": { "q": "comm", "includes": "presence" },    "tier": "voiceplus",    "reason": "Présence en temps réel des collègues" },
    { "when": { "q": "fonc", "includes": "m365" },        "tier": "voiceplus",    "reason": "Intégration Microsoft 365 / Google Workspace" },
    { "when": { "q": "comm", "includes": "rec" },         "tier": "enhanced",     "reason": "Enregistrement des appels" },
    { "when": { "q": "comm", "includes": "rvi" },         "tier": "enhanced",     "reason": "Accueil automatisé (RVI à niveaux)" },
    { "when": { "q": "comm", "includes": "video" },       "tier": "complete",     "reason": "Vidéoconférence (Business Connect Video)" },
    { "when": { "q": "comm", "includes": "audioconf" },   "tier": "complete",     "reason": "Conférences audio illimitées" },
    { "when": { "q": "fonc", "includes": "crm" },         "tier": "complete",     "reason": "Intégration CRM (Salesforce, Zendesk, etc.)" },
    { "when": { "q": "fonc", "includes": "collab" },      "tier": "complete",     "reason": "Collaboration d'équipe avancée" },
    { "when": { "q": "fonc", "includes": "analytics" },   "tier": "complete",     "reason": "Rapports d'utilisation et analytics" },
    { "when": { "q": "comm", "includes": "supervision" }, "tier": "completeplus", "reason": "Supervision et coaching des appels" },
    { "when": { "q": "fonc", "includes": "multisite" },   "tier": "completeplus", "reason": "Gestion multisite" },
    { "when": { "q": "fonc", "includes": "compliance" },  "tier": "completeplus", "reason": "Archivage et conformité" },
    { "when": { "q": "fonc", "includes": "api" },         "tier": "completeplus", "reason": "Accès API pour intégrations sur mesure" }
  ],

  /* --------------------------------------------------------------------------
     NOTES POUR LA VENTE (rapport de qualification)
     Les {id} sont remplacés par la réponse correspondante;
     {lignes.pub} = champ "pub" de la question à compteurs "lignes".
     -------------------------------------------------------------------------- */
  "salesNoteRules": [
    { "when": { "q": "lignes", "field": "pub", "gt": 0 },       "note": "⚠️ {lignes.pub} ligne(s) publique(s) (alarme incendie / sécurité / ascenseur) — prévoir une solution dédiée (ligne numérique ou cellulaire)." },
    { "when": { "q": "lignes", "field": "ext", "gt": 0 },       "note": "{lignes.ext} extension(s) simple(s) (sans boîte vocale ni mise en garde) — valider la tarification réduite." },
    { "when": { "q": "sit_engagement", "equals": "oui" },       "note": "Engagement en cours jusqu'au {sit_eng_fin} — coût mensuel actuel : {sit_eng_cout}. Vérifier les frais de résiliation et planifier la transition." },
    { "when": { "q": "num_sansfrais", "equals": "porter" },     "note": "Numéro sans frais à porter." },
    { "when": { "q": "num_sansfrais", "equals": "nouveau" },    "note": "Nouveau numéro sans frais à commander." },
    { "when": { "q": "num_autres", "includes": "porter" },      "note": "Numéros supplémentaires à porter — voir la liste dans les réponses." },
    { "when": { "q": "num_autres", "includes": "nouveaux" },    "note": "{num_autres_nb} nouveau(x) numéro(s) à commander." },
    { "when": { "q": "comm", "includes": "sms" },               "note": "SMS d'affaires requis sur le numéro d'entreprise." },
    { "when": { "q": "comm", "includes": "queue" },             "note": "File d'attente d'appels à configurer (call queues) — valider la distribution des appels avec le client." },
    { "when": { "q": "comm", "includes": "rvi" },               "note": "Accueil automatisé (RVI) : {comm_rvi_nb} menu(s)/choix à concevoir." },
    { "when": { "q": "fonc", "includes": "crm" },               "note": "CRM à intégrer : {fonc_crm} — valider la compatibilité (Complete minimum)." },
    { "when": { "q": "fonc", "includes": "multisite" },         "note": "Déploiement multisite : {fonc_sites_nb} emplacement(s)." },
    { "when": { "q": "fonc", "includes": "annonce" },           "note": "Annonce interne / interphone — prévoir un ATA ou un adaptateur compatible." },
    { "when": { "q": "fax_type", "includes": "traditionnel" },  "note": "Télécopieur traditionnel — prévoir des lignes supplémentaires et un adaptateur ATA." },
    { "when": { "q": "tels", "includes": "existants" },         "note": "Appareils existants à réutiliser : {tels_existants} — vérifier la compatibilité avec Business Connect." },
    { "when": { "q": "sit_internet", "equals": "moins50" },     "note": "Internet actuel < 50 Mbps — valider la bande passante disponible pour garantir la qualité des appels." },
    { "when": { "q": "sit_internet", "equals": "nsp" },         "note": "Vitesse Internet inconnue — valider la bande passante disponible pour garantir la qualité des appels." }
  ],

  /* --------------------------------------------------------------------------
     ÉQUIPEMENTS À PRÉVOIR (rapport de qualification)
     -------------------------------------------------------------------------- */
  "equipmentRules": [
    { "when": { "q": "tels", "includes": "bureau" },           "item": "Téléphones de bureau IP — quantité à valider selon les lignes ({lignes.ind} individuelle(s) + {lignes.part} partagée(s))" },
    { "when": { "q": "tels", "includes": "sansfil" },          "item": "Téléphones sans fil WiFi/DECT (ex. Yealink W76P)" },
    { "when": { "q": "tels", "includes": "receptionniste" },   "item": "Téléphone(s) de réceptionniste avec touches de postes (BLF)" },
    { "when": { "q": "tels", "includes": "conference" },       "item": "Téléphone(s) de conférence pour salle de réunion" },
    { "when": { "q": "fax_type", "includes": "traditionnel" }, "item": "Adaptateur ATA pour télécopieur traditionnel (+ lignes supplémentaires)" },
    { "when": { "q": "fonc", "includes": "annonce" },          "item": "ATA/adaptateur pour annonce interne et interphone" }
  ]
};
