# Synapse Server (secbrain)

This is the backend server for Synapse, a "second brain" application that allows users to store, organize, and share various types of digital content (articles, tweets, documents, youtube videos, etc.) using tags. It is built with Node.js, Express, TypeScript, and MongoDB.

## Features

* **Google OAuth Authentication**: Secure user login and registration using Google accounts.
* **Content Management**: Create, read, and delete different types of content (articles, links, notes, code snippets, etc.).
* **Tagging System**: Organize content with custom tags.
* **Content Sharing**: Generate public shareable links for specific content and revoke them when needed.
* **TypeScript & Zod**: Strongly typed backend with runtime input validation.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JWT, Google Auth Library
* **Validation:** Zod
* **Other Tools:** CORS, dotenv, nanoid

## Prerequisites

Before running the project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd synapse-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory and add the following variables:
```bash
# MongoDB Connection String
MONGO_URL=mongodb://localhost:27017/synapse 

# Secret key for JWT signing
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Running the Application

Compiles the TypeScript code into the dist folder and starts the server.

```bash
npm run backend
```

# API Documentation

## API Endpoints

### Authentication (`/api/auth`)

* **POST `/google-login`**
  Authenticate user via Google OAuth ID token and return a JWT.

---

### Content Board (`/api/content`)

> Requires `Authorization: Bearer <token>` header

* **POST `/board`**
  Add new content to the user's board.

  **Body:**

  ```json
  {
    "type": "string",
    "link": "string (optional)",
    "note": "string (optional)",
    "title": "string",
    "tags": ["string"]
  }
  ```

* **GET `/board`**
  Fetch all content for the authenticated user.

* **DELETE `/board/:contentId`**
  Delete a specific piece of content.

---

### Sharing (`/api/content`)

> Requires `Authorization: Bearer <token>` header for creation/revocation

* **POST `/share`**
  Generate a public, shareable link for a specific content ID.

  **Body:**

  ```json
  {
    "contentId": "string"
  }
  ```

* **POST `/unshare`**
  Make shared content private again by revoking the share link.

  **Body:**

  ```json
  {
    "contentId": "string"
  }
  ```

* **GET `/:shareLine`** *(Public)*
  Fetch content using its unique share link identifier.

---

## Project Structure

```
src/
├── database/
│   └── db.ts          # Mongoose schemas and DB connection logic
├── middleware/
│   └── middleware.ts  # JWT Authentication middleware
├── routes/
│   ├── auth.ts        # Authentication routes (Google Login)
│   └── content.ts     # Content CRUD and sharing routes
└── index.ts           # Express app entry point

package.json
tsconfig.json
.env                   # Environment variables (not in version control)
```