## Restaurant Review System

This is the API for a restaurant review system. It allows users to create, retrieve, update, and delete restaurant reviews (functionality may vary based on implementation).

**Table of Contents**

* Project Overview: #project-overview
* Installation: #installation
* Usage: #usage
* API Documentation: #api-documentation
* Contributing: #contributing
* License: #license

**Project Overview**

This project provides a RESTful API for managing restaurant reviews. 
Users can be of 3 types:
* admin, businessOwner & user
* The permissions to perform operations is based on the rules defined for each user.

##### Operations
User:
* CRUD operation for a user (of any type).
* Login by using credentials and fetch JWT token.

Restaurant:
* CRUD operation of busineessOwner and admin to create restaurants in the listing.

Review:
* Create new reviews for existing restaurants.
* Retrieve existing reviews for a restaurant or all restaurants.
* Update their own reviews.
* Delete their own reviews.
* Response to a review by restaurant owner or admin only.

**Prerequisites**

* Node.js and npm (or yarn) installed on your system.
* A MongoDB database instance running.

**Installation**

1. **Clone this repository:**

   ```bash
   git clone https://github.com/NKrChauhan/restaurant-review-system.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd restaurant-review-system
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

   (or `yarn install` if using yarn)

4. **Environment Variables:**

   Create a `.env` file in the project root directory and set the following environment variable:

   - `MONGO_URI`: Your MongoDB connection string.

**Usage**

1. **Start the Server:**

   ```bash
   npm start
   ```

   (or `yarn start`)

   This will start the server on port `3000` by default (configurable in the code).

**API Documentation**

The API uses JSON for request and response bodies. Here are the main endpoints:

This document outlines the API endpoints for managing users, restaurants and reviews in the system. The base URL for all requests is assumed to be `http://localhost:3000/api/v1`.

**Authentication:**

Most user and restaurant management endpoints require authentication using a JSON Web Token (JWT). You can obtain a JWT by logging in with a user's email and password.

**User Endpoints**

* **Create User (POST /users):**
    * Requires no authorization.
    * Request Body:
        * `name`: User's full name (required)
        * `email`: User's email address (required)
        * `password`: User's password (required)
        * `role`: User's role (optional, defaults to "user") - possible values might be "businessOwner" or others depending on your implementation.
    * Response:
        * On success, returns a JSON object with the newly created user's information.
        * On error, returns a JSON object with an error message.
* **Login User (POST /users/login):**
    * Requires no authorization.
    * Request Body:
        * `email`: User's email address (required)
        * `password`: User's password (required)
    * Response:
        * On success, returns a JSON object containing the token and potentially other user info.
        * On error, returns a JSON object with an error message.
* **Get User Info (GET /users/me):**
    * Requires authorization with a valid JWT token.
    * Response:
        * On success, returns a JSON object containing the authenticated user's information.
        * On error, returns a JSON object with an error message.
* **Update User (PUT /users/me):**
    * Requires authorization with a valid JWT token.
    * Request Body:
        * Any user fields you want to update (e.g., `name`, `email`).
    * Response:
        * On success, returns a JSON object containing the updated user information.
        * On error, returns a JSON object with an error message.
* **Delete User (DELETE /users/me):**
    * Requires authorization with a valid JWT token (usually associated with the business owner role).
    * Response:
        * On success, returns a JSON object with a success message.
        * On error, returns a JSON object with an error message.

**Restaurant Endpoints** (assuming a business owner is logged in)

* **Create Restaurant (POST /restaurants):**
    * Requires authorization with a valid JWT token.
    * Request Body:
        * `name`: Restaurant name (required)
        * `cuisine`: Restaurant cuisine type (required)
        * `phone`: Restaurant phone number eg: '123-123-123'
        * `description`: Description of the restaurant
        * `address`: Object containing address details
            * `street`: Street address
            * `city`: City
            * `state`: State
            * `zipcode`: Zip code
    * Response:
        * On success, returns a JSON object with the newly created restaurant information.
        * On error, returns a JSON object with an error message.
* **Get Restaurants (GET /restaurants):**
    * Requires no authorization.
    * Response:
        * On success, returns a JSON array containing all restaurants.
        * On error, returns a JSON object with an error message.
* **Get Restaurant Details (GET /restaurants/:restaurantId):**
    * Requires no authorization.
    * Path Parameter:
        * `:restaurantId`: ObjectID of the restaurant you want to retrieve.
    * Response:
        * On success, returns a JSON object containing the requested restaurant's information.
        * On error, returns a JSON object with an error message.
* **Delete Restaurant (DELETE /restaurants/:restaurantId):**
    * Requires authorization with a valid JWT token (usually associated with the business owner role).
    * Path Parameter:
        * `:restaurantId`: ObjectID of the restaurant you want to delete.
    * Response:
        * On success, returns a JSON object with a success message.
        * On error, returns a JSON object with an error message.


**Review Endpoints** (assuming a user is logged in)
* **Create a New Review (POST /api/v1/reviews):**
    * Requires authentication (details below).
    * Request Body:
        * `restaurantId`: ObjectID of the restaurant to be reviewed (required).
        * `rating`: Rating (integer between 1 and 5) (required).
        * `reviewText`: Text content of the review (required).
    * Response:
        * On success, returns a JSON object with the newly created review.
        * On error, returns a JSON object with an error message.

* **Get All Reviews for a Restaurant (GET /api/v1/reviews/:restaurantId):**
    * No authentication required.
    * Path Parameter:
        * `:restaurantId`: ObjectID of the restaurant whose reviews you want to retrieve.
    * Response:
        * On success, returns a JSON array containing all reviews for the specified restaurant.
        * On error, returns a JSON object with an error message.

* **Get a Specific Review (GET /api/v1/reviews/:reviewId):**
    * No authentication required for public access (optional, based on your implementation).
    * Path Parameter:
        * `:reviewId`: ObjectID of the specific review to retrieve.
    * Response:
        * On success, returns a JSON object containing the requested review.
        * On error, returns a JSON object with an error message.

* **Update a Review (PUT /api/v1/reviews/:reviewId):** (Optional, based on your implementation)
    * Requires authentication and authorization for the review owner.
    * Path Parameter:
        * `:reviewId`: ObjectID of the review to update.
    * Request Body:
        * Optional fields for update (e.g., `rating`, `reviewText`).
    * Response:
        * On success, returns a JSON object with the updated review.
        * On error, returns a JSON object with an error message.

* **Delete a Review (DELETE /api/v1/reviews/:reviewId):** (Optional, based on your implementation)
    * Requires authentication and authorization for the review owner.
    * Path Parameter:
        * `:reviewId`: ObjectID of the review to delete.
    * Response:
        * On success, returns a JSON object with a message indicating success.
        * On error, returns a JSON object with an error message.


### Postman collections for the project

You can find the postman collections in the root folder of project. name: `Restaurant listing.postman_collection.json` 

**License**

This project is licensed under the MIT License (see LICENSE