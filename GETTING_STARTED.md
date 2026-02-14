# Guide de Démarrage - Système d'Authentification et de Rôles

## 🎯 Fonctionnalités implémentées

### 1. Champ Company

- ✅ Ajout du champ `company` au register
- ✅ Stockage dans la base de données
- ✅ Retourné lors du login

### 2. Système d'Activation

- ✅ Les nouveaux comptes sont inactifs par défaut (`isActive: false`)
- ✅ Les utilisateurs ne peuvent pas se connecter tant que leur compte n'est pas activé
- ✅ Endpoint d'activation disponible pour les administrateurs

### 3. Système de Rôles (RBAC)

- ✅ Distinction entre utilisateurs (`user`) et administrateurs (`admin`)
- ✅ Protection des routes sensibles
- ✅ Guards JWT et Roles
- ✅ Décorateur personnalisé `@Roles()`

## 🚀 Démarrage rapide

### 1. Créer un administrateur

Avant de pouvoir activer des comptes, vous devez créer un administrateur :

```bash
npm run seed:admin
```

**Credentials créés :**

- Email : `admin@btp.com`
- Password : `adminPassword123`
- Role : `admin`
- isActive : `true`

⚠️ **Important :** Changez ce mot de passe après la première connexion !

### 2. Démarrer le serveur

```bash
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000`

### 3. Tester l'API

#### a) Créer un utilisateur normal

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Acme Corporation"
}
```

**Résultat :** Compte créé avec `role: "user"` et `isActive: false`

#### b) Se connecter en tant qu'admin

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@btp.com",
  "password": "adminPassword123"
}
```

**Réponse :**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@btp.com",
    "name": "Administrator",
    "isActive": true,
    "role": "admin"
  }
}
```

#### c) Activer le compte utilisateur (Admin uniquement)

```bash
PATCH http://localhost:3000/auth/activate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": "<user_id>"
}
```

#### d) Se connecter en tant qu'utilisateur

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📁 Structure des fichiers

```
src/auth/
├── decorators/
│   └── roles.decorator.ts          # Décorateur @Roles()
├── dto/
│   ├── activate.dto.ts             # DTO pour l'activation
│   ├── login.dto.ts                # DTO pour le login
│   └── register.dto.ts             # DTO pour le register (+ company)
├── enums/
│   └── role.enum.ts                # Enum des rôles (USER, ADMIN)
├── guards/
│   ├── jwt-auth.guard.ts           # Guard d'authentification JWT
│   └── roles.guard.ts              # Guard de vérification des rôles
├── schemas/
│   └── user.schema.ts              # Schéma User (+ company, isActive, role)
├── strategies/
│   └── jwt.strategy.ts             # Stratégie JWT (mise à jour)
├── auth.controller.ts              # Contrôleur avec endpoint protégé
├── auth.service.ts                 # Service avec méthode activateUser
└── auth.module.ts

scripts/
└── seed-admin.ts                   # Script de création d'admin
```

## 📚 Documentation

- **[ACTIVATION_FEATURE.md](./ACTIVATION_FEATURE.md)** - Documentation du système d'activation
- **[ROLES_AND_GUARDS.md](./ROLES_AND_GUARDS.md)** - Documentation complète du système de rôles

## 🔐 Sécurité

### Routes protégées

| Route                  | Authentification | Rôle requis |
| ---------------------- | ---------------- | ----------- |
| `POST /auth/register`  | ❌ Non           | -           |
| `POST /auth/login`     | ❌ Non           | -           |
| `PATCH /auth/activate` | ✅ Oui           | ADMIN       |

### Ajouter une protection à une route

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

// Route accessible uniquement aux admins
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@Get('admin-only')
adminOnlyRoute() {
  return { message: 'Admin access granted' };
}

// Route accessible à tous les utilisateurs authentifiés
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('protected')
protectedRoute() {
  return { message: 'User authenticated' };
}
```

## 🧪 Tests

### Tester avec Swagger

1. Démarrer le serveur : `npm run start:dev`
2. Ouvrir : `http://localhost:3000/api`
3. Utiliser l'interface Swagger pour tester les endpoints

### Tester avec Postman/Thunder Client

1. Créer un utilisateur avec `POST /auth/register`
2. Se connecter en tant qu'admin avec `POST /auth/login`
3. Copier le `access_token` de la réponse
4. Utiliser ce token dans le header `Authorization: Bearer <token>`
5. Activer le compte utilisateur avec `PATCH /auth/activate`

## 🐛 Dépannage

### Erreur : "Account is not activated"

- Le compte n'a pas été activé par un admin
- Solution : Utiliser l'endpoint `/auth/activate` avec un token admin

### Erreur : "Forbidden resource"

- L'utilisateur n'a pas le rôle requis
- Solution : Vérifier que l'utilisateur a le rôle `admin` pour les routes protégées

### Erreur : "Unauthorized"

- Token JWT manquant ou invalide
- Solution : Se connecter et utiliser le token dans le header

## 📝 Prochaines étapes

1. ✅ Créer un admin avec `npm run seed:admin`
2. ✅ Tester l'enregistrement d'un utilisateur
3. ✅ Tester l'activation par l'admin
4. ✅ Tester la connexion de l'utilisateur activé
5. 🔄 Implémenter d'autres routes protégées selon vos besoins
6. 🔄 Ajouter des tests unitaires et e2e

## 🤝 Contribution

Pour ajouter de nouveaux rôles ou permissions, consultez la documentation dans `ROLES_AND_GUARDS.md`.
