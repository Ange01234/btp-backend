# Système de Rôles et Protection des Routes

## Vue d'ensemble

Ce système implémente une gestion des rôles (RBAC - Role-Based Access Control) pour distinguer les utilisateurs normaux des administrateurs. Les routes sensibles sont protégées et accessibles uniquement aux utilisateurs ayant le rôle approprié.

## Rôles disponibles

### Enum Role (`role.enum.ts`)

```typescript
export enum Role {
  USER = 'user', // Utilisateur normal
  ADMIN = 'admin', // Administrateur
}
```

## Architecture de sécurité

### 1. Guards

#### JwtAuthGuard (`jwt-auth.guard.ts`)

- Vérifie que l'utilisateur est authentifié
- Valide le token JWT
- Extrait les informations de l'utilisateur

#### RolesGuard (`roles.guard.ts`)

- Vérifie que l'utilisateur a le rôle requis
- Fonctionne en combinaison avec le décorateur `@Roles()`
- Retourne `403 Forbidden` si le rôle ne correspond pas

### 2. Décorateur personnalisé

#### @Roles() (`roles.decorator.ts`)

```typescript
@Roles(Role.ADMIN)  // Accessible uniquement aux admins
@Roles(Role.USER)   // Accessible uniquement aux users
@Roles(Role.ADMIN, Role.USER)  // Accessible aux deux
```

### 3. Stratégie JWT mise à jour

La stratégie JWT récupère maintenant toutes les informations de l'utilisateur depuis la base de données :

- Vérifie que l'utilisateur existe
- Vérifie que le compte est actif (`isActive: true`)
- Retourne les informations complètes incluant le rôle

## Modifications du schéma User

### Nouveau champ : `role`

```typescript
@Prop({ type: String, enum: Role, default: Role.USER })
role: Role;
```

**Comportement :**

- Valeur par défaut : `Role.USER`
- Valeurs possibles : `'user'` ou `'admin'`
- Stocké en base de données comme string

## Utilisation

### Protection d'une route (Admin uniquement)

```typescript
@Patch('activate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
activateUser(@Body() activateDto: ActivateDto) {
  return this.authService.activateUser(activateDto.userId);
}
```

**Ordre des guards :**

1. `JwtAuthGuard` - Vérifie l'authentification
2. `RolesGuard` - Vérifie le rôle

### Protection d'une route (Utilisateur authentifié)

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getProfile(@Request() req) {
  return req.user;
}
```

## Réponses du serveur

### Login réussi

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Acme Corporation",
    "isActive": true,
    "role": "user"
  }
}
```

### Tentative d'accès sans authentification

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Tentative d'accès sans le bon rôle

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Création d'un administrateur

### Script de seed

Un script est disponible pour créer un administrateur initial :

```bash
npm run seed:admin
```

**Credentials par défaut :**

- Email : `admin@btp.com`
- Password : `adminPassword123`
- Role : `admin`
- isActive : `true`

⚠️ **Important :** Changez le mot de passe après la première connexion !

### Création manuelle via la base de données

Si vous devez créer un admin manuellement :

```javascript
{
  "email": "admin@example.com",
  "password": "$2b$10$hashedPassword...",  // Hash bcrypt
  "name": "Admin Name",
  "role": "admin",
  "isActive": true
}
```

## Flux de travail complet

### 1. Enregistrement d'un utilisateur normal

```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Acme Corp"
}
```

**Résultat :** Compte créé avec `role: "user"` et `isActive: false`

### 2. Connexion admin

```bash
POST /auth/login
{
  "email": "admin@btp.com",
  "password": "adminPassword123"
}
```

**Résultat :** Token JWT avec rôle admin

### 3. Activation du compte utilisateur (Admin uniquement)

```bash
PATCH /auth/activate
Authorization: Bearer <admin_token>
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Résultat :** Compte utilisateur activé

### 4. Connexion utilisateur

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Résultat :** Token JWT avec rôle user

## Endpoints protégés

| Endpoint         | Méthode | Authentification | Rôle requis |
| ---------------- | ------- | ---------------- | ----------- |
| `/auth/register` | POST    | ❌ Non           | -           |
| `/auth/login`    | POST    | ❌ Non           | -           |
| `/auth/activate` | PATCH   | ✅ Oui           | ADMIN       |

## Bonnes pratiques

### 1. Toujours utiliser les deux guards ensemble

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

### 2. Documenter avec Swagger

```typescript
@ApiBearerAuth()  // Indique que le Bearer token est requis
@ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
```

### 3. Vérifier le rôle côté frontend

```typescript
if (user.role === 'admin') {
  // Afficher les fonctionnalités admin
}
```

⚠️ **Note :** La vérification côté frontend est pour l'UX uniquement. La vraie sécurité est côté backend !

## Tests recommandés

1. ✅ Créer un utilisateur normal et vérifier que `role === 'user'`
2. ✅ Tenter d'accéder à `/auth/activate` sans token → 401
3. ✅ Tenter d'accéder à `/auth/activate` avec un token user → 403
4. ✅ Accéder à `/auth/activate` avec un token admin → 200
5. ✅ Vérifier que le script seed crée un admin avec `isActive: true`

## Extension future

Pour ajouter de nouveaux rôles :

1. Modifier l'enum `Role`

```typescript
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator', // Nouveau rôle
}
```

2. Mettre à jour le schéma User

```typescript
@Prop({ type: String, enum: Role, default: Role.USER })
role: Role;
```

3. Utiliser le nouveau rôle

```typescript
@Roles(Role.MODERATOR)
```
