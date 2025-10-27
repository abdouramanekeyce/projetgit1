#!/bin/bash

# Script : merge-html.sh
# Description : Résout automatiquement les conflits dans les fichiers HTML
#               en gardant les deux versions (HEAD et branche distante).

echo "🔍 Recherche des fichiers HTML avec conflits..."

# Rechercher tous les fichiers HTML contenant des marqueurs de conflit
files=$(grep -rl '<<<<<<< HEAD' --include \*.html .)

if [ -z "$files" ]; then
  echo "✅ Aucun conflit HTML trouvé."
  exit 0
fi

for file in $files; do
  echo "⚙️  Fusion du fichier : $file"

  # Créer une version propre
  awk '
  BEGIN { inside=0 }
  /<<<<<<< HEAD/ { print "<div class=\"from-head\">"; inside=1; next }
  /=======/ { print "</div>\n<div class=\"from-branch\">"; next }
  />>>>>>>/ { print "</div>"; inside=0; next }
  { print }
  ' "$file" > "${file}.merged"

  mv "${file}.merged" "$file"
  echo "✅ Conflits fusionnés proprement dans $file"
done

echo "🎉 Fusion automatique terminée. Vérifie le rendu HTML avant de valider."
