# HapiJS API Seed App
A general set of API endpoints that most apps use.

# Documentation
Found here: `http://localhost:<port>/documentation`

# Primary Technologies Used
- Javascript (ES2015, ES2016, ES2017)
- Node.js
- Hapi.js
- MongoDB
- Redis

# Installation
- `npm install && npm start`

# App Structure and Responsibilities
- actions
- auth
- config
- email
- handlers
- linters
- responses
- routes
    - _Contents_: .js files only
    - *Structure*: Flat. This directory should only contain js files in the root, no additional subdirectories.
    - *Responsibility*: Define the routes and configurations of those routes including:
        - `method`
        - `path`
        - `auth`
        - `handler`
        - `response` (response validation)
        - `validate` (payload validation)
- test
- validation
- entry.js
- globalRateLimiting.js
- index.js

# Run Tests
- `npm test`
