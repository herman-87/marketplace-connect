

## Plan : Refonte Auth + Systeme de Souscription

### 1. Page de Connexion (Auth.tsx)

**Suppression des regles de validation :**
- Retirer les schemas Zod (`emailSchema`, `passwordSchema`)
- Retirer la fonction `validateForm` et les etats d'erreur
- Connexion : naviguer directement vers `/dashboard` sans appeler `signIn` (mode prototype)
- Inscription : naviguer directement vers `/dashboard` sans appeler `signUp`

**Panneau gauche - Image de fond :**
- Remplacer le gradient orange et les icones par une image de fond en `background-image` couvrant tout le panneau
- Utiliser une image Unsplash representant l'esprit e-commerce/marketplace (photo de boutique moderne, collaboration, ou commerce africain)
- Conserver un overlay sombre semi-transparent avec le logo FastRelays et un slogan par-dessus l'image

### 2. Systeme de Souscription

**Nouveau contexte : `SubscriptionContext.tsx`**
- Etat local `isPro` (boolean, `false` par defaut)
- Fonction `upgradeToPro()` qui passe `isPro` a `true`
- Persistance dans `localStorage` pour le prototype

**Nouvelle page : `Subscription.tsx` (`/subscription`)**
- Titre : "Passez a l'Espace Pro"
- Un seul plan affiche dans une carte :
  - Nom : "Plan Starter"
  - Prix : 0 XAF / mois
  - Description : Acces complet a toutes les fonctionnalites pro
  - Liste des avantages : Creer des business, Gerer les commandes, Equipes et collaborateurs, Engagement et statistiques
  - Bouton "Activer gratuitement"
- Au clic sur le bouton : appeler `upgradeToPro()` puis rediriger vers `/dashboard`

**Sidebar (`AppSidebar.tsx`) - Verrouillage Espace Pro :**
- Consommer `useSubscription()` pour verifier `isPro`
- Si `isPro === false` :
  - Afficher "Espace Pro" avec une icone de cadenas (Lock) au lieu du chevron
  - Au clic, rediriger vers `/subscription` au lieu de derouler les items
  - Appliquer un style grise/attenue sur le label
- Si `isPro === true` : comportement actuel inchange

**MobileNav (`MobileNav.tsx`) - Meme logique :**
- Les items lies a l'espace pro (Business, Collab, Commandes) redirigent vers `/subscription` si non pro

### 3. Route

- Ajouter `<Route path="/subscription" element={<Subscription />} />` dans `App.tsx`
- Wrapper `SubscriptionProvider` dans `App.tsx` autour des enfants

---

### Details techniques

**Fichiers a creer :**
- `src/contexts/SubscriptionContext.tsx`
- `src/pages/Subscription.tsx`

**Fichiers a modifier :**
- `src/pages/Auth.tsx` - retirer validation, navigation directe, image de fond a gauche
- `src/components/layout/AppSidebar.tsx` - verrouillage conditionnel Espace Pro
- `src/components/layout/MobileNav.tsx` - verrouillage conditionnel items pro
- `src/App.tsx` - ajouter route `/subscription` et `SubscriptionProvider`

