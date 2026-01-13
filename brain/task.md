## 1. Logique MLM & Attribution <!-- id: 100 -->
- [x] Implémenter la détection du `distributorId` (URL/LocalStorage) <!-- id: 101 -->
- [x] Gérer l'attribution par défaut "Direct Yupi" <!-- id: 102 -->
- [x] Créer le service de notification MLM (Event/Webhook vers système tiers) <!-- id: 103 -->

## 2. Validation d'Inventaire & Flux de Commande <!-- id: 200 -->
- [x] Ajouter une validation de stock stricte avant création de commande <!-- id: 201 -->
- [x] Garantir l'atomicité de l'opération (Transaction DB) <!-- id: 202 -->
- [x] Assigner le statut `Pending` initial <!-- id: 203 -->

## 3. Système de Paiement (Phase 1) <!-- id: 300 -->
- [x] Finaliser l'intégration de la redirection vers les passerelles (Moneroo/Axa Zara) <!-- id: 301 -->
- [x] Sécuriser les Webhooks de confirmation <!-- id: 302 -->
- [x] Déclencher l'événement "Paid" et la notification MLM <!-- id: 303 -->

## 4. Synchronisation YupiMall Admin <!-- id: 500 -->
- [x] Mettre à jour `src/lib/axios.ts` vers l'API v1 <!-- id: 501 -->
- [x] Connecter le Dashboard aux statistiques réelles <!-- id: 502 -->
- [x] Connecter la liste et le détail des commandes à l'API <!-- id: 503 -->
- [x] Afficher les nouveaux champs de livraison dans l'interface <!-- id: 504 -->

## 5. Vérification & Tests Finaux <!-- id: 600 -->
- [x] Simuler un achat complet et vérifier dans l'Admin <!-- id: 601 -->
- [x] Vérifier la notification MLM lors du paiement <!-- id: 602 -->

## 6. Réversion & Stabilisation Dashboard <!-- id: 700 -->
- [x] Rétablir le répertoire `/dashboard` et supprimer `/overview` <!-- id: 701 -->
- [x] Restaurer la navigation Sidebar vers le Dashboard <!-- id: 702 -->
- [x] Recréer le `layout.tsx` du dashboard pour restaurer la Sidebar <!-- id: 703 -->
- [x] Stabiliser le code (remplacement des Grid instables par Box/Stack pour MUI v7) <!-- id: 704 -->
- [x] Résoudre les erreurs de syntaxe et de typage TypeScript <!-- id: 705 -->

## 7. Refonte Dashboard (Design Exact) <!-- id: 800 -->
- [x] Étape 1 : Nettoyage + Breadcrumb + Titre section + Icônes MUI <!-- id: 801 -->
- [x] Étape 2 : Nouvelles cartes doubles (remplace stats) <!-- id: 802 -->
- [x] Étape 3 : Sales by Country + Performance Chart <!-- id: 803 -->
- [x] Étape 4 : Top Product Sales <!-- id: 804 -->
- [x] Étape 5 : Améliorer TopCustomers + TopCouriers → TeamMembers <!-- id: 805 -->

---

## 8. Système Multi-Projets & Rôles <!-- id: 900 -->
- [x] Mettre à jour les modèles et types de rôles (Backend) <!-- id: 901 -->
- [x] Gérer les rôles dans la session Auth (Frontend Global) <!-- id: 902 -->
- [x] Initialiser le projet `yupimall-dev` (Monitoring) <!-- id: 903 -->
- [x] Initialiser le projet `yupimall-webmaster` (Opérationnel) <!-- id: 904 -->
- [/] Configurer les permissions et filtrage par pays <!-- id: 905 -->
- [ ] Préparer le suivi par code pour les clients invités <!-- id: 906 -->

**✅ Étape 2 : Initialisation des projets terminée !**
**🚀 Étape 3 : Configuration des permissions et filtrage territorial**
