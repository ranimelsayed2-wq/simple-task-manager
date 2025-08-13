# Simple Task Manager API

## Description
A RESTful API to manage tasks (To-Dos) using Node.js, Express, and MongoDB.  
Users can create, read, update, and delete tasks via simple HTTP requests.

---

## Features
- Create a task (`POST /tasks`)
- Get all tasks (`GET /tasks`)
- Update a task (`PUT /tasks/:id`)
- Delete a task (`DELETE /tasks/:id`)
- Task has:
  - `title` (String, required)
  - `completed` (Boolean, default: false)

---

## Tech Stack
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Jest + Supertest (for testing)
- Postman (for manual testing)

---

## Installation
1. Clone the repository:
```bash
git clone <your-repo-url>
cd simple-task-manager
