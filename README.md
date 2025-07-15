# Event Management REST API

A backend API for managing events and user registrations, built with Node.js, Express, and PostgreSQL.

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd <repo-folder>
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```
     DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
     ```
4. **Sync the database**
   ```sh
   node src/db/sync.js
   ```
5. **Start the server**
   ```sh
   node src/app.js
   ```

## API Endpoints

### 1. Create Event
- **POST /events**
- **Body:**
  ```json
  {
    "title": "Event Title",
    "datetime": "2025-08-01T18:00:00.000Z",
    "location": "New York",
    "capacity": 100
  }
  ```
- **Response:**
  ```json
  { "eventId": 1 }
  ```

### 2. Get Event Details
- **GET /events/:id**
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Event Title",
    "datetime": "2025-08-01T18:00:00.000Z",
    "location": "New York",
    "capacity": 100,
    "registrations": [
      { "id": 1, "name": "Alice", "email": "alice@example.com" }
    ]
  }
  ```

### 3. Register for Event
- **POST /events/:id/register**
- **Body:**
  ```json
  { "userId": 1 }
  ```
- **Response:**
  ```json
  { "message": "Registration successful." }
  ```

### 4. Cancel Registration
- **DELETE /events/:id/register**
- **Body:**
  ```json
  { "userId": 1 }
  ```
- **Response:**
  ```json
  { "message": "Registration cancelled." }
  ```

### 5. List Upcoming Events
- **GET /events/upcoming**
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Event Title",
      "datetime": "2025-08-01T18:00:00.000Z",
      "location": "New York",
      "capacity": 100,
      "registrations": [ ... ]
    }
  ]
  ```

### 6. Event Stats
- **GET /events/:id/stats**
- **Response:**
  ```json
  {
    "totalRegistrations": 10,
    "remainingCapacity": 90,
    "percentUsed": 10
  }
  ```

## Error Handling
- Returns appropriate HTTP status codes and error messages for all failures (e.g., 400, 404, 409, 500).

## Notes
- All dates must be in ISO format.
- Capacity must be between 1 and 1000.
- Registration and cancellation require a valid `userId` in the request body. 