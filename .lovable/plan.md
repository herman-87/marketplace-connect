
# Roadmap prototype — échéance 12 juillet 2026

Analyse rapide de l'existant vs. la liste demandée, puis plan de mise en œuvre. Toutes les tâches restent au niveau **prototype front-end** (mock data), en cohérence avec l'architecture actuelle (React + Vite + Tailwind + shadcn, contextes pour Cart/Favorites/Reviews/Subscription).

## 1. État actuel (déjà en place)

- Auth : page `/auth` connectée à Lovable Cloud (login/signup)
- Boutiques : liste, détail public (`MarketplaceShopDetail`), création (`CreateBusinessSheet`), paramètres
- Produits : liste, détail, création (avec caractéristiques clé/valeur), preview, promos
- Commandes : cycle de vie (`OrderTimeline`, `OrderActionPanel`, `ConfirmationDialog`, `RejectionReasonDialog`), chat de commande basique
- Favoris (produits), Reviews (produits), Wallet page (vue seule), célébrations paiement
- Prix HT/TTC (`price-display.tsx`, `tax.ts`)

## 2. Écarts identifiés (à réaliser)

### 1. Utilisateur
- (manquant) Page **Profil utilisateur** (édition nom, avatar, email, tel)
- (manquant) **Reset password** : page `/forgot-password` + `/reset-password`

### 2. Business
- (manquant) **Recherche avancée** (subjective / fuzzy) dans `MarketplaceShops` et `MesBusiness` (filtres + query textuelle sur nom, description, catégorie, ville, tags)
- (manquant) **Suppression** d'une boutique (action destructive avec `AlertDialog`)
- (manquant) **Publier / Dépublier** une boutique (toggle `isPublished`, badge visuel)
- (manquant) Page **Conditions / Clauses** de la plateforme + **pop-up de rappel** à la 1ʳᵉ connexion / création boutique

### 3. Produits
- (manquant) **Recherche avancée** produits (feed marketplace + gestion)
- (manquant) **Recherche avancée** promotions
- (manquant) **Suppression** produit (AlertDialog + retrait du feed)
- (manquant) **Nombre de likes** affiché sur cartes produit
- (manquant) **Produits similaires** (même catégorie) sur `ProductDetail`

### 4. Feedback
- (existant) Reviews produits
- (manquant) Feedback sur **promotion** (réutiliser `ReviewDialog` + `ReviewsContext` étendu)
- (manquant) Feedback sur **boutique** (idem, section notes sur `MarketplaceShopDetail`)

### 5. Likes
- (partiel) `FavoritesContext` existe pour produits
- (manquant) Compteur likes visible sur cartes (produits + promotions + boutiques)
- (manquant) Like sur **promotions** (bouton cœur + persistance)
- (manquant) Like sur **boutiques** (idem)

### 6. Commandes
- (partiel) Cycle existant, mais :
- (manquant) Étape **Paiement** déclenchée depuis la commande (pas seulement le panier)
- (manquant) **Lancer la livraison** (action côté vendeur → statut `in_delivery`)
- (manquant) **Confirmation de réception** (action côté acheteur → statut `delivered`)
- (manquant) **Numéro de commande** au format `<slug-boutique>-<YYYYMMDD>-<seq>` (ex : `chez-fatou-20260702-0042`)

### 7. Paiement
- (partiel) `WalletPage` existe (vue seule)
- (manquant) **Solde + rechargement** + historique
- (manquant) **Liste transactions** utilisateur (page dédiée avec filtres)
- (manquant) **Paiement direct** (bouton Payer sur commande, sans passer par le tunnel panier)
- (manquant) **Annulation demande de paiement** (statut `payment_pending` → `cancelled`)

### 8. Messages
- (partiel) `OrderChat` avec messages démo
- (manquant) Intégration complète : liste de conversations par commande, badge non-lus, envoi + accusé, pièce jointe simulée, séparation acheteur/vendeur

### 9. Notifications
- (partiel) UI dans `AppLayout` avec mock
- (manquant) **Système** : store global `NotificationsContext`, émission depuis les actions (nouvelle commande, paiement, livraison, like, review, invit…), persistance mock, marquage lu, deep-link

## 3. Découpage en lots (ordre proposé)

**Lot A — Fondations utilisateur & juridique** (petit)
1. Page profil `/profil` (édition mock, avatar upload local)
2. `/forgot-password` + `/reset-password` (Supabase `resetPasswordForEmail` + `updateUser`)
3. Page `/conditions` + composant `TermsReminderDialog` (localStorage flag `terms_ack_v1`)

**Lot B — Likes & recherche transverses** (moyen)
4. Extension `FavoritesContext` → `LikesContext` (produits, promotions, boutiques) + compteurs mock
5. Composant réutilisable `AdvancedSearch` (input + filtres popover + tri) branché sur : `MarketplaceShops`, `MesBusiness`, `ProductsFeed`, `PromotionsFeed`, `MarketplacePromotions`

**Lot C — Cycle boutique / produit complet** (moyen)
6. Actions Publier/Dépublier + Supprimer boutique (`MesBusiness` + `BusinessSettings`)
7. Suppression produit (`ProductsFeed`)
8. Produits similaires (`ProductDetail` — filtre par catégorie sur `mockProducts`)

**Lot D — Feedback étendu** (petit)
9. `ReviewsContext` : ajout des cibles `promotion` et `shop`
10. Boutons "Laisser un avis" sur `PromotionsFeed` et `MarketplaceShopDetail`

**Lot E — Commandes & paiement** (gros)
11. Générateur `orderNumber` (`src/lib/orderNumber.ts`) + application partout
12. Bouton "Payer" sur commande + `PaymentStep` réutilisable hors panier
13. Actions "Lancer livraison" (vendeur) et "Confirmer réception" (acheteur) dans `OrderActionPanel` + `OrderTimeline`
14. `WalletPage` v2 : solde, rechargement mock, historique transactions
15. Page `/transactions` (liste filtrable)
16. Annulation demande de paiement (statut + action)

**Lot F — Messagerie commande** (moyen)
17. `OrderChat` complet : conversations par commande, non-lus, pièces jointes mock, indicateur lu

**Lot G — Notifications** (moyen)
18. `NotificationsContext` global + hook `notify()` similaire à `celebrate()`
19. Émissions depuis : création commande, paiement, changement statut, like, review, invitation collab
20. UI existante branchée sur le contexte (remplacer mock)

## 4. Détails techniques

- Pas de nouveau backend requis : tout en mock + contextes React, sauf `/reset-password` qui utilise Supabase Auth déjà en place.
- Recherche subjective : `Fuse.js` (ajout dépendance) pour matcher nom + description + tags avec tolérance.
- `orderNumber` : slug boutique via `slugify` (regex simple) + date + compteur incrémental en mémoire.
- Likes/notifications persistés dans `localStorage` pour survivre au refresh du prototype.
- Toutes les nouvelles actions destructives passent par `AlertDialog` (déjà dispo dans shadcn).
- Toutes les célébrations réutilisent `celebrate()` existant.

## 5. Livrables par lot

Chaque lot = 1 PR/itération, testée visuellement, avec :
- Routes ajoutées à `App.tsx`
- Entrées de nav mises à jour (`AppSidebar`, `MobileNav`, `BusinessMobileNav`) si nécessaire
- i18n FR/EN sur les nouveaux libellés
- Respect design monochrome + orange CTA

Confirmez si l'ordre A→G vous convient ou si vous souhaitez prioriser un lot (par ex. E — commandes & paiement — en premier), et je démarre par le lot choisi.
