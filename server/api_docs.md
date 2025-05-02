# BumiKarya API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication via a JWT token.

Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Public Endpoints

### Home

```
GET /
```

Returns basic application information.

**Response**:
```json
{
  "msg": "BumiKarya by fuad <HCK-82/P2/IP> public",
  "app_version": 1.0
}
```

### Authentication

#### Register

```
POST /register
```

Register a new user account.

**Request Body**:
```json
{
  "fullName": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 - Created)**:
```json
{
  "id": 1,
  "fullName": "User Name",
  "email": "user@example.com",
  "isAdmin": false
  // other user details (password excluded)
}
```

**Error Responses**:
- 400: Bad Request (validation errors)

#### Login

```
POST /login
```

Authenticate user and get access token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 - OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- 400: Bad Request (missing email/password)
- 401: Unauthorized (invalid credentials)

#### Google Login

```
POST /google-login
```

Authenticate using Google credentials.

**Request Body**:
```json
{
  "token": "google_id_token"
}
```

**Response (200 - OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- 400: Bad Request (missing token)
- 401: Unauthorized (invalid token)

### User Profile

#### Get Profile

```
GET /profile
```

Get the authenticated user's profile information.

**Headers**:
- Authorization: Bearer token

**Response (200 - OK)**:
```json
{
  "id": 1,
  "fullName": "User Name",
  "email": "user@example.com",
  "profilePicture": "https://example.com/profile.jpg",
  "address": "User Address",
  "phoneNumber": "081234567890",
  "createdAt": "2025-05-01T12:00:00.000Z",
  "updatedAt": "2025-05-01T12:00:00.000Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Not Found (user not found)

#### Update Profile

```
PUT /profile/update
```

Update the authenticated user's profile.

**Headers**:
- Authorization: Bearer token

**Request Body**:
```json
{
  "fullName": "Updated Name",
  "address": "New Address",
  "phoneNumber": "087654321098"
}
```

**Response (200 - OK)**:
```json
{
  "id": 1,
  "fullName": "Updated Name",
  "email": "user@example.com",
  "address": "New Address",
  "phoneNumber": "087654321098"
  // other profile details
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Not Found (user not found)

### Products

#### Get All Products

```
GET /products
```

Retrieve all products.

**Query Parameters**:
- search (optional): Search term for filtering products
- page (optional): Page number for pagination
- size (optional): Number of items per page

**Response (200 - OK)**:
```json
{
  "count": 50,
  "rows": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 100000,
      "stock": 50,
      "imageUrl": "https://example.com/product.jpg",
      "categoryId": 1,
      "createdAt": "2025-05-01T12:00:00.000Z",
      "updatedAt": "2025-05-01T12:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Category Name"
      }
    },
    // more products...
  ]
}
```

#### Get Product by ID

```
GET /products/:id
```

Retrieve a specific product by its ID.

**Parameters**:
- id: Product ID

**Response (200 - OK)**:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": 100000,
  "stock": 50,
  "imageUrl": "https://example.com/product.jpg",
  "categoryId": 1,
  "createdAt": "2025-05-01T12:00:00.000Z",
  "updatedAt": "2025-05-01T12:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Category Name"
  }
}
```

**Error Responses**:
- 404: Not Found (product not found)

#### Get Products by Category

```
GET /products/c/:categoryId
```

Get products filtered by category.

**Parameters**:
- categoryId: Category ID

**Response (200 - OK)**:
```json
{
  "count": 10,
  "rows": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 100000,
      "stock": 50,
      "imageUrl": "https://example.com/product.jpg",
      "categoryId": 1,
      "createdAt": "2025-05-01T12:00:00.000Z",
      "updatedAt": "2025-05-01T12:00:00.000Z"
    },
    // more products...
  ]
}
```

### Categories

#### Get All Categories

```
GET /categories
```

Retrieve all product categories.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Category 1",
    "description": "Category description",
    "createdAt": "2025-05-01T12:00:00.000Z",
    "updatedAt": "2025-05-01T12:00:00.000Z"
  },
  // more categories...
]
```

### Shopping Cart

#### Get Cart

```
GET /cart
```

Retrieve the current user's shopping cart.

**Headers**:
- Authorization: Bearer token

**Response (200 - OK)**:
```json
{
  "count": 2,
  "rows": [
    {
      "id": 1,
      "userId": 1,
      "productId": 1,
      "quantity": 2,
      "createdAt": "2025-05-01T12:00:00.000Z",
      "updatedAt": "2025-05-01T12:00:00.000Z",
      "Product": {
        "id": 1,
        "name": "Product Name",
        "price": 100000,
        "imageUrl": "https://example.com/product.jpg"
      }
    },
    // more cart items...
  ]
}
```

**Error Responses**:
- 401: Unauthorized

#### Add to Cart

```
POST /products/:id/add
```

Add a product to the shopping cart.

**Headers**:
- Authorization: Bearer token

**Parameters**:
- id: Product ID

**Request Body**:
```json
{
  "quantity": 1
}
```

**Response (200 - OK)**:
```json
{
  "message": "Product added to cart",
  "cart": {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "quantity": 1,
    "createdAt": "2025-05-01T12:00:00.000Z",
    "updatedAt": "2025-05-01T12:00:00.000Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Not Found (product not found)

#### Delete from Cart

```
DELETE /cart/:id/delete
```

Remove an item from the shopping cart.

**Headers**:
- Authorization: Bearer token

**Parameters**:
- id: Cart item ID

**Response (200 - OK)**:
```json
{
  "message": "Item removed from cart"
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Not Found (cart item not found)

### Explore Indonesia

```
POST /exploreindonesia
```

Get AI-powered information about Indonesia.

**Request Body**:
```json
{
  "query": "Tell me about Borobudur temple"
}
```

**Response (200 - OK)**:
```json
{
  "message": "Successfully retrieved information",
  "query": "Tell me about Borobudur temple",
  "result": "Borobudur is a 9th-century Mahayana Buddhist temple in Central Java, Indonesia..."
}
```

**Error Responses**:
- 400: Bad Request (missing query)

## Admin Endpoints

### Get All Users

```
GET /admin/users
```

Retrieve all registered users (admin only).

**Headers**:
- Authorization: Bearer token (admin)

**Response (200 - OK)**:
```json
{
  "count": 10,
  "rows": [
    {
      "id": 1,
      "fullName": "User Name",
      "email": "user@example.com",
      "address": "User Address",
      "phoneNumber": "081234567890",
      "createdAt": "2025-05-01T12:00:00.000Z",
      "updatedAt": "2025-05-01T12:00:00.000Z"
    },
    // more users...
  ]
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not an admin)

### Get Admin Profile

```
GET /admin/me
```

Retrieve admin profile information.

**Headers**:
- Authorization: Bearer token (admin)

**Response (200 - OK)**:
```json
{
  "id": 1,
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "profilePicture": "https://example.com/admin.jpg",
  "createdAt": "2025-05-01T12:00:00.000Z",
  "updatedAt": "2025-05-01T12:00:00.000Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not an admin)

### Update Admin Profile

```
PUT /admin/me/update
```

Update admin profile information.

**Headers**:
- Authorization: Bearer token (admin)

**Request Body**:
```json
{
  "fullName": "Updated Admin",
  "email": "updated.admin@example.com"
}
```

**Response (200 - OK)**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "fullName": "Updated Admin",
    "email": "updated.admin@example.com",
    "profilePicture": "https://example.com/admin.jpg",
    "createdAt": "2025-05-01T12:00:00.000Z",
    "updatedAt": "2025-05-01T12:00:00.000Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Not Found (admin not found)

## Error Responses

### Common Error Format

```json
{
  "message": "Error message"
}
```

### Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error