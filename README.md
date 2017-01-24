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

# App Structure
- actions
- auth
    - **Contents**: Authentication logic.
        - *global.js*: **All** endpoints require a valid access token to be passed in each request as a header value of `basic`. Any valid endpoint being requested without the basic auth header will be rejected with a 401 status code. Invalid endpoints will still return a 404 regardless.
        - *users.js*: **Most** endpoints (not all) require a valid user session to be passed in each request as a header value of `Authorization`. Exceptions to this requirement are endpoints that can't know this info yet (e.g. `/signup`, `/login`, etc.).
    - **Structure**: Flat. There is no need to add subdirectories to this directory.
    - **Responsibility**: Secure the API and protect user data.
- config
    - **Contents**: Configuration files in JSON format.
    - **Structure**: Flat. No subdirectories.
    - **Responsibility**: The base file is `default.json` which contains variables for all optional configurations in the application. Each file other than `default.json` is named for an associated environment (e.g. staging, production) and will override values defined in `default.json` when the same key exists in that particular environment config file.
- email
    - **Contents**: HTML templates for automated emails.
    - **Structure**: Flat. No subdirectories or partials since each email is unique.
    - **Responsibility**: These are email templates used for automated emails such as signup email verification, password reset, user invite, etc.
- handlers
- linters
    - **Philosophy**: Linting should be used both in real-time development and as a pre-commit hook in git.
    - **Contents**: .js files with linting rules defined in json format and exported.
    - **Structure**: Layered. A subdirectory should exist for each language you wish to lint. `/js` for `*.js` files, `/css` for all `*.css` files, etc.
    - **Responsibility**: Linting rules serve to align coding styles, enforce best practices, and prevent senseless errors.
- responses
    - **Philosophy**: Response validation provides another level of security for users. Responses going back to the client that aren't in the format intended, are prevented from being returned to the client.
    - **Contents**: .js files only.
    - **Structure**: Should match with the structure of the associated routes file(s). If I know there is a `/routes/users.js` file, I should also assume there is a `/response/users.js` file.
    - **Responsibility**: Two primary responsibilities:
        - *Validate response payload* - The response back to the client should look like the object we are expecting to send.
        - *Provide example response to API docs* - In a local development environment, accessing `/documentation` will return all endpoints with expected payload and expected response payload data models. The response payload data model is defined in this section.
- routes
    - **Philosophy**: Each major route with associated methods and child paths should be contained in an appropriately named js file.
        - *Example*: `users.js` should contain route configs for `POST /users`, `GET /users`, `GET /users/{id}`, etc.
    - **Contents**: .js files only
    - **Structure**: Flat. This directory should only contain js files in the root, no additional subdirectories.
    - **Responsibility**: Define the routes and configurations of those routes including:
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
