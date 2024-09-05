# Games API

## Overview
This API allows you to manage a collection of games and users. You can perform operations such as retrieving, creating, updating, and deleting games, managing users, and authenticating users.

All game-related routes require a valid JWT token, which is obtained upon successful login.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:BrunoYDev/GamesApi.git
   ```
2. Navigate to the project directory:
   ```bash
   cd GamesApi
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

#### User Login
- **Endpoint:** `/auth`
- **Method:** `POST`
- **Description:** Authenticates a user and provides a JWT token for accessing protected routes.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200 OK`: Returns a token if authentication is successful.
  - `400 Bad Request`: Invalid email or password provided.
  - `401 Unauthorized`: Incorrect email or password.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Error during authentication.

### User Management

#### Get All Users
- **Endpoint:** `/users`
- **Method:** `GET`
- **Description:** Retrieves a list of all users.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **Responses:**
  - `200 OK`: Returns a list of user objects (id, name, email).
  - `500 Internal Server Error`: If there's an error retrieving the users.

#### Create a User
- **Endpoint:** `/users`
- **Method:** `POST`
- **Description:** Creates a new user.
- **Request Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `201 Created`: User created successfully.
  - `400 Bad Request`: Missing or invalid name, email, or password.
  - `409 Conflict`: Email is already registered.
  - `500 Internal Server Error`: Error creating user.

### Game Management (Protected Routes)

> **Note:** All game-related endpoints require a valid JWT token, passed as a Bearer token in the `Authorization` header.

#### Get All Games
- **Endpoint:** `/games`
- **Method:** `GET`
- **Description:** Retrieves a list of all games.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **Responses:**
  - `200 OK`: Returns a list of game objects.
  - `401 Unauthorized`: No token provided or invalid token.
  - `500 Internal Server Error`: If there's an error retrieving the games.

#### Get a Game by ID
- **Endpoint:** `/games/{id}`
- **Method:** `GET`
- **Description:** Retrieves a game by its ID.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **URL Parameters:**
  - `id` (number): The ID of the game you want to retrieve.
- **Responses:**
  - `200 OK`: Returns the game object.
  - `400 Bad Request`: Invalid ID format.
  - `401 Unauthorized`: No token provided or invalid token.
  - `404 Not Found`: Game not found.

#### Create a Game
- **Endpoint:** `/games`
- **Method:** `POST`
- **Description:** Creates a new game.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **Request Body:**
  ```json
  {
    "title": "Game Title",
    "year": 2023,
    "price": 50
  }
  ```
- **Responses:**
  - `201 Created`: Game created successfully.
  - `400 Bad Request`: Invalid input data (title, year, or price missing or invalid).
  - `401 Unauthorized`: No token provided or invalid token.
  - `409 Conflict`: Game with the same title already exists.

#### Update a Game
- **Endpoint:** `/games/{id}`
- **Method:** `PATCH`
- **Description:** Updates an existing game. All fields are optional.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "year": 2023,
    "price": 60
  }
  ```
- **URL Parameters:**
  - `id` (number): The ID of the game you want to update.
- **Responses:**
  - `200 OK`: Game updated successfully.
  - `400 Bad Request`: No fields provided for update.
  - `401 Unauthorized`: No token provided or invalid token.
  - `404 Not Found`: Game not found.

#### Delete a Game
- **Endpoint:** `/games/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a game by its ID.
- **Headers:**
  - `Authorization`: `Bearer {token}`
- **URL Parameters:**
  - `id` (number): The ID of the game you want to delete.
- **Responses:**
  - `200 OK`: Game deleted successfully.
  - `400 Bad Request`: Invalid ID format.
  - `401 Unauthorized`: No token provided or invalid token.
  - `404 Not Found`: Game not found.

## Tools for Testing
You can use tools like [Insomnia](https://insomnia.rest/), [HTTPie](https://httpie.io/), or [Postman](https://www.postman.com/) to test the API endpoints. Ensure you pass the JWT token in the `Authorization` header for protected routes.

---
