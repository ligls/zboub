# -*- coding: utf-8 -*-
"""Génère index-client.html : copie d'index.html sans la vue vendeur ni la logique de commission."""
import re, sys

src = open('index.html', encoding='utf-8').read()
n0 = len(src)
def retirer(pattern, texte, flags=0, attendu=1):
    nouveau, n = re.subn(pattern, '', texte, flags=flags)
    if n != attendu:
        sys.exit(f"ÉCHEC: motif introuvable ou multiple ({n}x): {pattern[:70]}")
    return nouveau

# 1. Onglet (bouton) Vue vendeur
src = retirer(r'\n\s*<button type="button" data-onglet="vendeur">👔 Vue vendeur</button>', src)

# 2. Section HTML de la vue vendeur (bannière de commentaires incluse)
src = retirer(r'\n    <!-- =+ -->\n    <!-- ONGLET 4 : VUE VENDEUR \(INTERNE\)\s*-->\n    <!-- =+ -->\n    <section class="onglet" id="onglet-vendeur">.*?</section>\n', src, re.S)

# 3. CSS de la chaîne de commission
src = retirer(r'/\* Chaîne commission \(vue vendeur\) \*/\n.*?(?=\.toast\{)', src, re.S)

# 4. Fonction calculerCommission
src = retirer(r'/\* Vue vendeur : chaîne 100 → 125 → 150 → 200 % \*/\nfunction calculerCommission\(\)\{.*?\n\}\n', src, re.S)

# 5. Fonction rendreVendeur
src = retirer(r'/\* ---------------- Vue vendeur ---------------- \*/\nfunction rendreVendeur\(\)\{.*?\n\}\n', src, re.S)

# 6. Appel dans rendreRecap
src = retirer(r'\n  rendreVendeur\(\);', src)

# 7. Cas du switch liés à la vue vendeur
for cas in ["v-mode-interne", "v-cd", "v-base", "v-spiff"]:
    src = retirer(r'\n\s*case "' + cas + r'":[^\n]*break;', src)

# 8. Champs internes du devis par défaut
anc = '''    concurrent: { nom:"Bell", prixMois:0, financementMois:0, duree:24, fraisUnique:0 },
    modeInterne: false,
    appareilConnecte: false,
    commissionBase: 100,
    spiff: 0
  };'''
nou = '''    concurrent: { nom:"Bell", prixMois:0, financementMois:0, duree:24, fraisUnique:0 }
  };'''
if anc not in src: sys.exit("ÉCHEC: bloc devisDefaut introuvable")
src = src.replace(anc, nou)

# 9. Commentaire d'impression
src = src.replace("(devis + comparateur, jamais la commission)", "(devis + comparateur)")

# Garde-fou : plus aucune trace de commission/vendeur dans la version client
for interdit in ["commission", "Commission", "vendeur", "SPIFF", "spiff", "multiplicateur", "Multiplicateur", "modeInterne", "appareilConnecte", "Mode interne", "maillon"]:
    if interdit in src:
        sys.exit(f"ÉCHEC garde-fou: « {interdit} » encore présent dans la version client")

open('index-client.html', 'w', encoding='utf-8').write(src)
print(f"index-client.html généré : {n0} → {len(src)} caractères (−{n0-len(src)})")
