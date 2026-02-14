# Logique de Statut d'Activation des Utilisateurs

## Vue d'ensemble

Cette fonctionnalité implémente un système d'activation de compte pour les utilisateurs. Par défaut, lorsqu'un utilisateur s'enregistre, son compte est créé avec le statut `isActive: false`. L'utilisateur ne pourra pas se connecter tant que son compte n'aura pas été activé par un administrateur.

## Modifications apportées

### 1. Schéma User (`user.schema.ts`)

- **Nouveau champ** : `isActive` (boolean)
  - Valeur par défaut : `false`
  - Description : Indique si le compte utilisateur est actif

### 2. Service d'authentification (`auth.service.ts`)

#### Méthode `register()`

- Crée un nouvel utilisateur avec `isActive: false` par défaut
- Aucune modification nécessaire (le champ prend automatiquement la valeur par défaut)

#### Méthode `login()`

- **Nouvelle vérification** : Vérifie si `user.isActive === true`
- Si le compte n'est pas actif, retourne une erreur 401 avec le message :
  ```
  "Account is not activated. Please contact an administrator."
  ```
- Retourne maintenant le champ `isActive` dans la réponse

#### Nouvelle méthode `activateUser(userId: string)`

- Active un compte utilisateur en passant son ID
- Met à jour `isActive` à `true`
- Retourne un message de confirmation et les détails de l'utilisateur

### 3. Contrôleur d'authentification (`auth.controller.ts`)

#### Nouvel endpoint : `PATCH /auth/activate`

- **Body** : `{ "userId": "507f1f77bcf86cd799439011" }`
- **Réponse** :
  ```json
  {
    "message": "User account activated successfully",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "company": "Acme Corporation",
      "isActive": true
    }
  }
  ```

### 4. Nouveau DTO (`activate.dto.ts`)

- Validation du `userId` avec `@IsMongoId()`
- Documentation Swagger complète

## Flux d'utilisation

### 1. Enregistrement d'un utilisateur

```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Acme Corporation"
}
```

**Résultat** : Compte créé avec `isActive: false`

### 2. Tentative de connexion (compte non activé)

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Résultat** : Erreur 401 - "Account is not activated. Please contact an administrator."

### 3. Activation du compte (par un administrateur)

```bash
PATCH /auth/activate
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Résultat** : Compte activé avec succès

### 4. Connexion réussie

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Résultat** : Token JWT + informations utilisateur (incluant `isActive: true`)

## Sécurité

⚠️ **Important** : L'endpoint `/auth/activate` devrait être protégé et accessible uniquement aux administrateurs. Dans une implémentation future, il faudra :

1. Ajouter un guard d'authentification
2. Ajouter un guard de rôle (admin uniquement)
3. Possiblement ajouter un système de logs pour tracer les activations

## Exemple de protection (à implémenter)

```typescript
@Patch('activate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiOperation({ summary: 'Activate a user account (Admin only)' })
activateUser(@Body() activateDto: ActivateDto) {
  return this.authService.activateUser(activateDto.userId);
}
```

## Tests recommandés

1. ✅ Créer un utilisateur et vérifier que `isActive` est `false`
2. ✅ Tenter de se connecter avec un compte non activé
3. ✅ Activer un compte
4. ✅ Se connecter avec un compte activé
5. ✅ Tenter d'activer un utilisateur inexistant
