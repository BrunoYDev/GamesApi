# Games API

## Overview
This API allows you to manage a collection of games. You can perform operations such as retrieving, creating, updating, and deleting games.

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

### Get All Games
- **Endpoint:** `/games`
- **Method:** `GET`
- **Description:** Retrieves a list of all games.
- **Responses:**
  - `200 OK`: Returns a list of game objects.
  - `500 Internal Server Error`: If there's an error retrieving the games.

### Get a Game by ID
- **Endpoint:** `/games/{id}`
- **Method:** `GET`
- **Description:** Retrieves a game by its ID.
- **URL Parameters:**
  - `id` (number): The ID of the game you want to retrieve.
- **Responses:**
  - `200 OK`: Returns the game object.
  - `400 Bad Request`: Invalid ID format.
  - `404 Not Found`: Game not found.

### Create a Game
- **Endpoint:** `/games`
- **Method:** `POST`
- **Description:** Creates a new game.
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
  - `409 Conflict`: Game with the same title already exists.

### Update a Game
- **Endpoint:** `/games/{id}`
- **Method:** `PATCH`
- **Description:** Updates an existing game. All fields are optional.
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
  - `404 Not Found`: Game not found.
  - `500 Internal Server Error`: Error updating game.

### Delete a Game
- **Endpoint:** `/games/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a game by its ID.
- **URL Parameters:**
  - `id` (number): The ID of the game you want to delete.
- **Responses:**
  - `200 OK`: Game deleted successfully.
  - `400 Bad Request`: Invalid ID format.
  - `404 Not Found`: Game not found.
  - `500 Internal Server Error`: Error deleting game.

## Tools for Testing
You can use tools like [Insomnia](https://insomnia.rest/), [HTTPie](https://httpie.io/), or [Postman](https://www.postman.com/) to test the API endpoints.
