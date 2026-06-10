# Migration vers BetterAuth - Documentation

Ce document explique les changements apportés pour migrer l'application mobile vers le service d'authentification BetterAuth.

## Changements principaux

### 1. Service d'authentification
- **Ancien**: Service d'authentification basique avec JWT
- **Nouveau**: MSPR-HealthAI-Coach-Auth avec BetterAuth

### 2. Endpoints API

#### Ancien système:
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

#### Nouveau système (BetterAuth):
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription  
- `GET /api/session` - Vérification de session
- `GET /api/jwt` - Génération de JWT pour microservices
- `POST /api/auth/logout` - Déconnexion

### 3. Flux d'authentification

#### Connexion:
1. Appel à `POST /api/auth/login` avec email/mot de passe
2. Récupération de la session avec `GET /api/session`
3. Génération du JWT pour les autres microservices avec `GET /api/jwt`
4. Stockage du JWT et du profil utilisateur

#### Inscription:
1. Appel à `POST /api/auth/signup` avec email/mot de passe/nom
2. Vérification de l'email (asynchrone via BetterAuth)
3. Récupération de la session et du JWT
4. Stockage des données

### 4. Gestion des sessions
- Les cookies de session sont gérés automatiquement par BetterAuth
- L'application mobile doit inclure `credentials: 'include'` dans les requêtes
- La session est vérifiée au démarrage de l'application

## Configuration requise

### Côté serveur (MSPR-HealthAI-Coach-Auth):

Dans le fichier `.env` du service d'authentification:

```env
CORS_ORIGIN=http://localhost:8081  # URL de votre application mobile en développement
BETTER_AUTH_URL=http://localhost:3000
```

### Côté application mobile:

Dans `.env`:
```env
AUTH_SERVICE_URL=http://localhost:3000/api
# Pour Android:
# AUTH_SERVICE_URL=http://10.0.2.2:3000/api
```

## Gestion des erreurs

Les erreurs communes à gérer:
- `Email already exists` - Email déjà utilisé
- `Invalid credentials` - Identifiants incorrects
- `Email not verified` - Email non vérifié
- `Session expired` - Session expirée

## Sécurité

- Les tokens JWT sont stockés dans AsyncStorage (chiffré)
- Les cookies de session sont gérés par le navigateur/WebView
- La communication se fait en HTTPS en production
- Les tokens ont une durée de vie limitée (1h par défaut)

## Tests

Pour tester la nouvelle authentification:

1. Lancer le service d'authentification:
```bash
cd MSPR-HealthAI-Coach-Auth
bun run dev
```

2. Lancer l'application mobile:
```bash
cd mspr-healthai-coach-appmobile/HealthAi_Coach
npx expo start
```

3. Tester les flux:
- Inscription avec un nouvel email
- Connexion avec un compte existant
- Déconnexion
- Vérification de la persistance de session

## Déploiement

Pour le déploiement en production:

1. Configurer les variables d'environnement appropriées
2. S'assurer que CORS est correctement configuré
3. Utiliser HTTPS pour toutes les communications
4. Configurer le domaine approprié dans BetterAuth

## Dépendances

Aucune nouvelle dépendance n'est requise côté mobile. Le service BetterAuth gère:
- `better-auth` - Framework d'authentification
- `drizzle-orm` - ORM pour la base de données
- `resend` - Envoi d'emails

## Rollback

En cas de problème, pour revenir à l'ancien système:

1. Revert les changements dans `apiClient.ts`
2. Revert les changements dans `AppContext.tsx`
3. Revert les changements dans les écrans d'authentification
4. Redémarrer l'application

## Support

Pour toute question ou problème, consulter:
- [Documentation BetterAuth](https://better-auth.js.org/)
- [Dépôt GitHub BetterAuth](https://github.com/timothymiller/better-auth)
- [Documentation Drizzle ORM](https://orm.drizzle.team/)