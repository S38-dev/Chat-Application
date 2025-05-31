Absolutely! Here's a clean, professional `README.md` file tailored to your **chat application** project. This version includes all the basics you've mentioned (installation, environment setup, database setup, technologies used) without any emojis, fluff, or marketing drama—just solid dev-friendly documentation:

---

### `README.md`

````markdown
# Chat Application

A full-stack chat application built with React, Node.js, and PostgreSQL, featuring group and contact-based messaging functionality. This project includes a client-side built using React and a backend API developed with Express.

---

## Getting Started

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/S38-dev/Chat-Application.git chatsite
cd chatsite
````

### 2. Install Root Dependencies

Although this project follows a monorepo-style setup, each part (client and server) manages dependencies independently.

```bash
npm install
```

---

## Server Setup

### 3. Navigate to the `server` Directory

```bash
cd server
```

### 4. Create a `.env` File

Create a `.env` file in the `server` directory and add the following variables:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=sChat
DB_PASSWORD=
TEST_VAR="HelloEnv"
```

Adjust the `DB_PASSWORD` according to your local PostgreSQL setup.

---

## Client Setup

### 5. Open a New Terminal and Navigate to the Client Directory

```bash
cd chatsite
cd client
npm install
```

### 6. Run the React Frontend

```bash
npm run dev
```

---

## Database Setup

Back in your **server terminal**, run the following PostgreSQL commands:

### 7. Create the Database

```bash
createdb -U postgres sChat
```

### 8. Import the Schema

```bash
psql -U postgres -d sChat -f schema.sql
```

Make sure `schema.sql` is present in the root directory or provide the correct path.

---

## Run the Server

Back in the **server terminal**, start the server:

```bash
npm run dev
```

The server should now be connected to your PostgreSQL database and ready to serve API requests.

---

## Technologies Used

### Frontend

* React.js
* Vite
* CSS Modules

### Backend

* Node.js
* Express.js
* PostgreSQL
* dotenv
* pg (node-postgres)

### Testing

* Mocha
* Chai

### Project Structure

* **client/**: Frontend source code
* **server/**: Backend routes, DB config, tests, and API logic
* **uploads/**: File storage
* **schema.sql**: Database schema definition

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---


