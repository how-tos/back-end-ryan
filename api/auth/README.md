# `AUTH` Endpoints
## `/api/auth`

### Register – `POST /api/auth/register`
Register a new user.

#### Request Body
* **firstName** – required: `true`
* **password** – required: `true`, no strength or complexity requirements
* **lastName** – required: `true`
* **username** – required: `true`, unique: `true`

#### Response
* **201** – Successful account creation
  * **_id** – ID for new user
  * **name** – Object that holds the names
    * **first** – First name
    * **last** – Last name
  * **username**
* **400** – Username in use
  * **message** – "Username already in use."
  * **errorCode** – 11000
* **400** – Improper request

### Login – `POST /api/auth/login`
Log into the backend.

#### Request Body
* **Password** – required: `true`
* **Username** – required: `true`

#### Response
* **200** – Successful login
  * **message** – A nice welcome message. D'aww.
  * **token** – Token should be saved to the client, typically in `local storage`. Includ the token in the header of requests that require authorization. With `axios`, this can be done like so:
  ```js
  import axios from 'axios';

  const newHowTo = 'Fake How To';

  axios.post(
    'https://www.example.com/api/how-tos/',
    newHowTo,
    { headers: {Authorization: localStorage.getItem('token')}
  )
  .then(response => ...)
  ```
* **400** – Improper request
* **401** – Invalid credentials
