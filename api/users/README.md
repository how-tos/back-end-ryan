# `USERS` Endpoints
## `/api/users`

All `USERS` endpoints require a valid authentication token, which is created at login.

### Get Users – `GET /api/users/`
Request a list of users.

#### Request Body
N/A

#### Response
* **200** – Successful request
  * Array of User objects
* **401** – Unauthorized

### Get User by ID – `GET /api/users/:userId`
Request a specific user document.

The `/:userId` in the URL refers to the `id` of the User being requested.
For example: `/api/user/5cb796bf888e2408e065b4b2`

#### Request Body
N/A

#### Reponse
* **200** – Successful request
  * Response includes the User document
* **404** – Invalid `userID`

### Edit User – `PUT /api/users/:userId`
Edit a User. As of this writing, any authorized request can edit **any** user.

The `/:userId` in the URL refers to the `id` of the user being edited.
For example: `/api/users/:5cb5kc4653f1a305517a6745`

#### Request Body
* **firstName** – required: `false`
* **password** – required: `false`, no strength or complexity requirements
* **lastName** – required: `false`
* **username** – required: `false`, unique: `true`

#### Response
* **200** – Successful edit
  * **_id** – ID for new user
  * **name** – Object that holds the names
    * **first** – First name
    * **last** – Last name
  * **username**
* **400** – Improper request
* **400** – Username in use
  * **message** – "Username already in use."
  * **errorCode** – 11000
* **401** – Unauthorized
* **404** – No record found for `/:id`

### Delete User – `DELETE /api/users/:id`
Delete a user. As of this writing, any authorized request can delete **any** user.

The `/:id` in the URL refers to the `id` of the user being edited.
For example: `/api/users/:5cb5kc4653f1a305517a6745`

This action cannot be undone.

#### Request Body
N/A

#### Response
* **204** – Successful delete, no response body sent
* **401** – Unauthorized
* **404** – No record found for `/:id`