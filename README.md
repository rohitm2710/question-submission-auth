# Authentication API

Base URL (production):

```text
https://question-submission-auth.onrender.com
```

Base URL (local):

```text
http://localhost:3000
```

All request bodies must be JSON.

## Login

### Request

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

JavaScript example:

```js
const response = await fetch(
  'https://question-submission-auth.onrender.com/api/login',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'mypassword'
    })
  }
);

const result = await response.json();
console.log(result);
```

### Responses

Correct password, HTTP `200`:

```json
{
  "userExists": true,
  "passwordCorrect": true,
  "message": "Password is correct"
}
```

Incorrect password, HTTP `200`:

```json
{
  "userExists": true,
  "passwordCorrect": false,
  "message": "Password is incorrect"
}
```

User does not exist, HTTP `200`:

```json
{
  "userExists": false,
  "passwordCorrect": false,
  "message": "User does not exist"
}
```

Missing email or password, HTTP `400`:

```json
{
  "userExists": false,
  "passwordCorrect": false,
  "message": "Email and password are required"
}
```

## Change Password

The current password must be correct before the password is changed.

### Request

```http
POST /api/change-password
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

JavaScript example:

```js
const response = await fetch(
  'https://question-submission-auth.onrender.com/api/change-password',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'user@example.com',
      currentPassword: 'old-password',
      newPassword: 'new-password'
    })
  }
);

const result = await response.json();
console.log(result);
```

### Responses

Success, HTTP `200`:

```json
{
  "passwordChanged": true,
  "message": "Password changed successfully"
}
```

Incorrect current password, HTTP `401`:

```json
{
  "passwordChanged": false,
  "message": "Current password is incorrect"
}
```

Unknown user, HTTP `404`:

```json
{
  "passwordChanged": false,
  "message": "User does not exist"
}
```

Invalid or missing fields, HTTP `400`:

```json
{
  "passwordChanged": false,
  "message": "Email, current password, and new password are required"
}
```

## Running Locally

```bash
npm install
npm start
```

The local API runs at `http://localhost:3000`.

Required environment variable:

```text
DATABASE_URL=your_database_connection_string
```

Set `DATABASE_URL` in `.env`. Never commit `.env` or share its value.

## Vercel Deployment

This project is prepared to run on Vercel as a serverless API.

1. Import the repo into Vercel.
2. Use the root directory as the project root.
3. Set the environment variable `DATABASE_URL` in the Vercel project settings.
4. Keep the default install command: `npm install`
5. No custom build command is required for this setup.

The API routes are served from:

- `/api/login`
- `/api/change-password`

## Render Deployment

- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `DATABASE_URL`
- Root directory: leave blank

The `PORT` variable is provided automatically by Render.

## Security Note

Passwords are currently stored and compared as plain text. Use password hashing, such as bcrypt or Argon2, before using this API in production.
