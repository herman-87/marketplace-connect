
# Marketplace Header - Affichage direct sur mobile

## Constat actuel
Le header du marketplace affiche deja les boutons directement (pas de menu burger). Cependant, sur mobile :
- Le texte "Connexion" est masque (seule l'icone utilisateur apparait)
- Le nom "FastRelays" est masque

## Modifications prevues

### `src/components/marketplace/MarketplaceHeader.tsx`
- Rendre le texte "Connexion" toujours visible (supprimer la classe `hidden sm:inline` sur le span)
- Ajuster les tailles des boutons pour que tout tienne bien sur mobile (texte plus petit si necessaire avec `text-xs sm:text-sm`)
- S'assurer que le bouton de recherche mobile, le theme toggle, le selecteur de langue, le panier et le bouton connexion restent tous visibles sans menu burger

## Section technique
- Modifier la ligne 150 : retirer `hidden sm:inline` du span "Connexion" ou le remplacer par un affichage responsive adapte
- Aucun nouveau composant, aucune nouvelle dependance
