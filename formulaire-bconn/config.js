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
    "subtitle": "Questionnaire de qualification — Solution téléphonique d'affaires",
    "intro": "Ce questionnaire prend environ 5 à 8 minutes. Vos réponses nous permettront de préparer une proposition personnalisée pour votre entreprise. Vos réponses sont sauvegardées automatiquement dans votre navigateur.",
    "showRecommendationToClient": true,
    "formspreeEndpoint": ""
  },

  "tiers": [
    { "id": "mobile",       "label": "Mobile",              "description": "Appels et SMS via l'application mobile uniquement." },
    { "id": "voice",        "label": "Voice",               "description": "Appels de base, boîte vocale, appels locaux illimités." },
    { "id": "voiceplus",    "label": "Voice+",              "description": "Voice + présence, intégrations Office/Google, fax de base." },
    { "id": "enhanced",     "label": "Enhanced",            "description": "Voice+ + enregistrement d'appels, IVR avancé, files d'attente avancées." },
    { "id": "complete",     "label": "Complete",            "description": "Enhanced + conférences audio, vidéoconférence, intégrations CRM (Salesforce, Zendesk), chat/collaboration, analytics, call delegation." },
    { "id": "completeplus", "label": "Complete Plus (BTL)", "description": "Complete + supervision des appels, hotdesking, accès API, archivage/conformité, multi-site complet, files d'attente en débordement." }
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
          "id": "q1", "type": "tel", "required": true,
          "label": "Quel est votre numéro principal d'entreprise?",
          "placeholder": "Ex. : 418 555-0123"
        },
        {
          "id": "q2", "type": "yesno", "required": true,
          "label": "Avez-vous un numéro 1-800 / sans frais?"
        },
        {
          "id": "q2a", "type": "radio", "required": true,
          "label": "Pour ce numéro sans frais, souhaitez-vous :",
          "showIf": { "q": "q2", "equals": "oui" },
          "options": [
            { "value": "porter",  "label": "Le transférer chez TELUS (portabilité)" },
            { "value": "nouveau", "label": "En obtenir un nouveau" }
          ]
        },
        {
          "id": "q3", "type": "yesno", "required": true,
          "label": "Avez-vous d'autres numéros à transférer (porter)?"
        },
        {
          "id": "q3a", "type": "textarea", "required": true,
          "label": "Listez les numéros à transférer (un par ligne)",
          "showIf": { "q": "q3", "equals": "oui" },
          "placeholder": "418 555-0001\n418 555-0002"
        },
        {
          "id": "q3b", "type": "number", "required": false, "min": 0,
          "label": "Aurez-vous besoin de nouveaux numéros? Indiquez combien (0 si aucun)",
          "showIf": { "q": "q3", "equals": "non" }
        }
      ]
    },

    {
      "id": "situation",
      "title": "Votre situation actuelle",
      "icon": "🏢",
      "questions": [
        {
          "id": "q4", "type": "radio", "required": true,
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
          "id": "q5", "type": "radio", "required": true,
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
          "id": "q6", "type": "yesno", "required": true,
          "label": "Avez-vous un engagement/contrat en cours?"
        },
        {
          "id": "q6a", "type": "date", "required": true,
          "label": "Date de fin de l'engagement",
          "showIf": { "q": "q6", "equals": "oui" }
        },
        {
          "id": "q6b", "type": "currency", "required": true, "min": 0,
          "label": "Coût mensuel actuel (avant taxes)",
          "showIf": { "q": "q6", "equals": "oui" },
          "placeholder": "Ex. : 250"
        },
        {
          "id": "q7", "type": "checkbox", "required": true, "exclusive": "aucun",
          "label": "Avez-vous déjà des services TELUS?",
          "options": [
            { "value": "tsb",      "label": "Internet affaires (TSB)" },
            { "value": "mobilite", "label": "Mobilité" },
            { "value": "tele",     "label": "Télé" },
            { "value": "aucun",    "label": "Aucun" }
          ]
        },
        {
          "id": "q8", "type": "radio", "required": true,
          "label": "Quelle est la vitesse de votre Internet actuel (ou vendu)?",
          "options": [
            { "value": "moins50", "label": "Moins de 50 Mbps" },
            { "value": "50a300",  "label": "50 à 300 Mbps" },
            { "value": "300a1g",  "label": "300 Mbps à 1 Gbps" },
            { "value": "1g5plus", "label": "1,5 Gbps et plus" },
            { "value": "nsp",     "label": "Je ne sais pas" }
          ]
        },
        {
          "id": "q9", "type": "yesno", "required": true,
          "label": "Avez-vous un système d'alarme relié à votre ligne téléphonique fixe?"
        },
        {
          "id": "alerte_alarme", "type": "alert", "style": "warning",
          "showIf": { "q": "q9", "equals": "oui" },
          "text": "Important : votre système d'alarme utilise la ligne fixe. Une solution alternative (ligne numérique ou cellulaire pour l'alarme) devra être prévue lors de la migration."
        }
      ]
    },

    {
      "id": "usage",
      "title": "Utilisation et fonctionnalités",
      "icon": "👥",
      "questions": [
        {
          "id": "q10", "type": "number", "required": true, "min": 1,
          "label": "Combien d'employés utiliseront le téléphone?",
          "help": "Chaque employé = 1 licence = 1 poste."
        },
        {
          "id": "q11", "type": "checkbox", "required": true,
          "label": "Comment vos employés utiliseront-ils le service?",
          "options": [
            { "value": "mobile",   "label": "Application mobile" },
            { "value": "desktop",  "label": "Application de bureau (PC/Mac)" },
            { "value": "combines", "label": "Combinés téléphoniques physiques" }
          ]
        },
        {
          "id": "q11a", "type": "number", "required": true, "min": 1,
          "label": "Combien de combinés physiques?",
          "showIf": { "q": "q11", "includes": "combines" }
        },
        {
          "id": "q12", "type": "yesno", "required": true,
          "label": "Avez-vous besoin d'envoyer/recevoir des messages textes (SMS) avec le numéro d'entreprise?"
        },
        {
          "id": "q13", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de l'enregistrement des appels?"
        },
        {
          "id": "q14", "type": "yesno", "required": true,
          "label": "Utilisez-vous un CRM ou un système de point de vente à intégrer?"
        },
        {
          "id": "q14a", "type": "radio", "required": true,
          "label": "Lequel?",
          "showIf": { "q": "q14", "equals": "oui" },
          "options": [
            { "value": "salesforce", "label": "Salesforce" },
            { "value": "hubspot",    "label": "HubSpot" },
            { "value": "lightspeed", "label": "Lightspeed" },
            { "value": "m365",       "label": "Microsoft 365" },
            { "value": "autre",      "label": "Autre" }
          ]
        },
        {
          "id": "q14b", "type": "text", "required": true,
          "label": "Précisez votre CRM / système de point de vente",
          "showIf": { "q": "q14a", "equals": "autre" }
        },
        {
          "id": "q15", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de gérer une file d'attente d'appels (plusieurs appels en attente distribués aux employés)?"
        },
        {
          "id": "q16", "type": "yesno", "required": true,
          "label": "Besoin de transfert interne direct entre les combinés (boutons de postes)?"
        }
      ]
    },

    {
      "id": "equipements",
      "title": "Équipements et configuration",
      "icon": "🔧",
      "questions": [
        {
          "id": "q17", "type": "yesno", "required": true,
          "label": "Avez-vous un fax?"
        },
        {
          "id": "q17a", "type": "radio", "required": true,
          "label": "Votre fax est-il numérique ou analogique?",
          "showIf": { "q": "q17", "equals": "oui" },
          "options": [
            { "value": "numerique",  "label": "Numérique" },
            { "value": "analogique", "label": "Analogique" }
          ]
        },
        {
          "id": "alerte_fax", "type": "alert", "style": "info",
          "showIf": { "q": "q17a", "equals": "analogique" },
          "text": "Un adaptateur ATA sera prévu pour connecter votre fax analogique."
        },
        {
          "id": "q18", "type": "yesno", "required": true,
          "label": "Avez-vous un système d'annonce interne / intercom / haut-parleur de plafond?"
        },
        {
          "id": "alerte_intercom", "type": "alert", "style": "info",
          "showIf": { "q": "q18", "equals": "oui" },
          "text": "Un équipement compatible (ATA/adaptateur) sera prévu pour votre système d'annonce."
        },
        {
          "id": "q19", "type": "yesno", "required": true,
          "label": "Besoin de haut-parleur (mains libres) sur les combinés?"
        },
        {
          "id": "q20", "type": "yesno", "required": true,
          "label": "Avez-vous des prises Ethernet disponibles aux postes de travail?"
        },
        {
          "id": "alerte_ethernet", "type": "alert", "style": "info",
          "showIf": { "q": "q20", "equals": "non" },
          "text": "Sans prises Ethernet, des combinés sans fil WiFi ou DECT (ex. Yealink W76P) seront recommandés."
        },
        {
          "id": "q21", "type": "yesno", "required": true,
          "label": "Besoin d'un téléphone de conférence (salle de réunion)?"
        }
      ]
    },

    {
      "id": "avancees",
      "title": "Fonctionnalités avancées et options",
      "icon": "⚙️",
      "questions": [
        {
          "id": "q22", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de conférences audio illimitées (webinaires, réunions clients avec participants externes)?"
        },
        {
          "id": "q23", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de réunions vidéo / vidéoconférence (Business Connect Video) pour vos employés?"
        },
        {
          "id": "q24", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de voir la disponibilité en temps réel de vos collègues (statut présence : disponible, occupé, absent)?"
        },
        {
          "id": "q25", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de supervision/coaching des appels (écoute, assistance, reprise d'appel par un superviseur)?"
        },
        {
          "id": "q26", "type": "yesno", "required": true,
          "label": "Avez-vous besoin d'un menu vocal personnalisé (IVR) pour automatiser l'accueil des appels?"
        },
        {
          "id": "q26a", "type": "number", "required": true, "min": 1,
          "label": "Combien de branches/menus avez-vous besoin?",
          "showIf": { "q": "q26", "equals": "oui" }
        },
        {
          "id": "q27", "type": "yesno", "required": true,
          "label": "Avez-vous plusieurs succursales/emplacements à gérer (multi-site)?"
        },
        {
          "id": "q27a", "type": "number", "required": true, "min": 2,
          "label": "Combien de sites?",
          "showIf": { "q": "q27", "equals": "oui" }
        },
        {
          "id": "q28", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de partage de documents et collaboration en équipe (chat interne, partage de fichiers, gestion de tâches)?"
        },
        {
          "id": "q29", "type": "checkbox", "required": true, "exclusive": "aucune",
          "label": "Avez-vous besoin d'intégrations avancées avec vos systèmes actuels?",
          "options": [
            { "value": "salesforce", "label": "Salesforce" },
            { "value": "zendesk",    "label": "Zendesk" },
            { "value": "dynamics",   "label": "Microsoft Dynamics" },
            { "value": "hubspot",    "label": "HubSpot" },
            { "value": "oracle",     "label": "Oracle" },
            { "value": "okta",       "label": "Okta" },
            { "value": "zapier",     "label": "Zapier" },
            { "value": "aucune",     "label": "Aucune" }
          ]
        },
        {
          "id": "q29a", "type": "yesno", "required": true,
          "label": "Ces intégrations sont-elles critiques pour vous?",
          "showIf": { "q": "q29", "includesOtherThan": "aucune" }
        },
        {
          "id": "q30", "type": "yesno", "required": true,
          "label": "Avez-vous besoin d'archivage et conformité (conservation des enregistrements/SMS/fax pour audit ou exigences légales)?"
        },
        {
          "id": "q31", "type": "yesno", "required": true,
          "label": "Avez-vous besoin d'un accès API pour développer des intégrations sur mesure?"
        },
        {
          "id": "q32", "type": "yesno", "required": true,
          "label": "Avez-vous besoin de rapports d'utilisation et d'analyse (tableaux de bord, performance des files d'attente, etc.)?"
        },
        {
          "id": "q33", "type": "yesno", "required": true,
          "label": "Avez-vous des assistantes exécutives qui gèrent les appels pour d'autres employés (call delegation)?"
        },
        {
          "id": "q33a", "type": "number", "required": true, "min": 1,
          "label": "Combien?",
          "showIf": { "q": "q33", "equals": "oui" }
        }
      ]
    },

    {
      "id": "contact",
      "title": "Vos coordonnées",
      "icon": "✉️",
      "questions": [
        {
          "id": "c_nom", "type": "text", "required": true,
          "label": "Votre nom complet"
        },
        {
          "id": "c_entreprise", "type": "text", "required": true,
          "label": "Nom de l'entreprise"
        },
        {
          "id": "c_courriel", "type": "email", "required": true,
          "label": "Courriel",
          "placeholder": "vous@entreprise.com"
        },
        {
          "id": "c_tel", "type": "tel", "required": true,
          "label": "Téléphone",
          "placeholder": "Ex. : 418 555-0123"
        },
        {
          "id": "c_moment", "type": "radio", "required": true,
          "label": "Meilleur moment pour un suivi",
          "options": [
            { "value": "matin",       "label": "Matin (8 h à 12 h)" },
            { "value": "apresmidi",   "label": "Après-midi (12 h à 17 h)" },
            { "value": "findejournee","label": "Fin de journée (17 h à 19 h)" },
            { "value": "nimporte",    "label": "Peu importe" }
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
    { "when": { "q": "q11", "includesAny": ["desktop", "combines"] }, "tier": "voice",        "reason": "Utilisation sur application de bureau ou combinés physiques" },
    { "when": { "q": "q17", "equals": "oui" },                        "tier": "voice",        "reason": "Service de fax requis" },
    { "when": { "q": "q24", "equals": "oui" },                        "tier": "voiceplus",    "reason": "Présence en temps réel des collègues" },
    { "when": { "q": "q13", "equals": "oui" },                        "tier": "enhanced",     "reason": "Enregistrement des appels" },
    { "when": { "q": "q26", "equals": "oui" },                        "tier": "enhanced",     "reason": "Menu vocal personnalisé (IVR)" },
    { "when": { "q": "q14", "equals": "oui" },                        "tier": "complete",     "reason": "Intégration CRM / point de vente" },
    { "when": { "q": "q22", "equals": "oui" },                        "tier": "complete",     "reason": "Conférences audio illimitées" },
    { "when": { "q": "q23", "equals": "oui" },                        "tier": "complete",     "reason": "Vidéoconférence (Business Connect Video)" },
    { "when": { "q": "q28", "equals": "oui" },                        "tier": "complete",     "reason": "Collaboration d'équipe avancée (chat, fichiers, tâches)" },
    { "when": { "q": "q29", "includesOtherThan": "aucune" },          "tier": "complete",     "reason": "Intégrations avancées (Salesforce, Zendesk, Dynamics, etc.)" },
    { "when": { "q": "q32", "equals": "oui" },                        "tier": "complete",     "reason": "Rapports d'utilisation et analytics" },
    { "when": { "q": "q33", "equals": "oui" },                        "tier": "complete",     "reason": "Call delegation (assistantes exécutives)" },
    { "when": { "q": "q25", "equals": "oui" },                        "tier": "completeplus", "reason": "Supervision et coaching des appels" },
    { "when": { "q": "q27", "equals": "oui" },                        "tier": "completeplus", "reason": "Gestion multi-site" },
    { "when": { "q": "q30", "equals": "oui" },                        "tier": "completeplus", "reason": "Archivage et conformité" },
    { "when": { "q": "q31", "equals": "oui" },                        "tier": "completeplus", "reason": "Accès API pour intégrations sur mesure" }
  ],

  /* --------------------------------------------------------------------------
     NOTES POUR LA VENTE (rapport de qualification)
     Les {qXX} sont remplacés par la réponse correspondante.
     -------------------------------------------------------------------------- */
  "salesNoteRules": [
    { "when": { "q": "q9",  "equals": "oui" },              "note": "⚠️ Système d'alarme relié à la ligne fixe — prévoir une solution alternative (ligne numérique/cellulaire) avant la migration." },
    { "when": { "q": "q6",  "equals": "oui" },              "note": "Engagement en cours jusqu'au {q6a} — coût mensuel actuel : {q6b}. Vérifier les frais de résiliation et planifier la transition." },
    { "when": { "q": "q2a", "equals": "porter" },           "note": "Portabilité du numéro sans frais à planifier." },
    { "when": { "q": "q2a", "equals": "nouveau" },          "note": "Nouveau numéro sans frais à commander." },
    { "when": { "q": "q3",  "equals": "oui" },              "note": "Numéros supplémentaires à porter — voir la liste dans les réponses." },
    { "when": { "q": "q12", "equals": "oui" },              "note": "SMS d'affaires requis sur le numéro d'entreprise." },
    { "when": { "q": "q15", "equals": "oui" },              "note": "File d'attente d'appels à configurer (call queues) — valider la distribution des appels avec le client." },
    { "when": { "q": "q16", "equals": "oui" },              "note": "Transfert interne direct requis — prévoir des combinés avec touches de postes (BLF)." },
    { "when": { "q": "q17a", "equals": "analogique" },      "note": "Fax analogique — ajouter un adaptateur ATA." },
    { "when": { "q": "q18", "equals": "oui" },              "note": "Intercom / annonce interne — prévoir un ATA ou adaptateur compatible." },
    { "when": { "q": "q20", "equals": "non" },              "note": "Pas de prises Ethernet aux postes — recommander des combinés WiFi ou DECT sans fil (ex. Yealink W76P)." },
    { "when": { "q": "q26", "equals": "oui" },              "note": "IVR : {q26a} branche(s)/menu(s) à concevoir." },
    { "when": { "q": "q27", "equals": "oui" },              "note": "Déploiement multi-site : {q27a} emplacement(s)." },
    { "when": { "q": "q29a", "equals": "oui" },             "note": "Intégrations critiques pour le client — niveau Complete minimum (Complete Plus si API sur mesure); valider la compatibilité avant la proposition." },
    { "when": { "q": "q33", "equals": "oui" },              "note": "Call delegation : {q33a} assistante(s) exécutive(s) à configurer." },
    { "when": { "q": "q8",  "equals": "moins50" },          "note": "Internet actuel < 50 Mbps — valider la bande passante disponible pour garantir la qualité des appels." },
    { "when": { "q": "q8",  "equals": "nsp" },              "note": "Vitesse Internet inconnue — valider la bande passante disponible pour garantir la qualité des appels." }
  ],

  /* --------------------------------------------------------------------------
     ÉQUIPEMENTS À PRÉVOIR (rapport de qualification)
     -------------------------------------------------------------------------- */
  "equipmentRules": [
    { "when": { "q": "q11", "includes": "combines" },  "item": "{q11a} combiné(s) IP de bureau" },
    { "when": { "q": "q20", "equals": "non" },         "item": "Combinés sans fil WiFi/DECT recommandés (ex. Yealink W76P)" },
    { "when": { "q": "q19", "equals": "oui" },         "item": "Combinés avec haut-parleur mains libres" },
    { "when": { "q": "q16", "equals": "oui" },         "item": "Combinés avec touches de postes (BLF) pour transfert direct" },
    { "when": { "q": "q17a", "equals": "analogique" }, "item": "1 adaptateur ATA (fax analogique)" },
    { "when": { "q": "q18", "equals": "oui" },         "item": "1 adaptateur ATA (intercom / annonce interne)" },
    { "when": { "q": "q21", "equals": "oui" },         "item": "Téléphone de conférence pour salle de réunion" }
  ]
};
