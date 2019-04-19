# `HOW-TO` Endpoints
## `/api/how-to`

### Schema – How To
* **_id** – The database automatically creates an ID, note the underscore
* **author** – The `_id` of the user who is credited as author
  * Required: `true`
* **created** – A `Date` that is automatically entered by the server at the time of the `POST` request
* **favoriteCount** – A `Number`, automatically updated when requests are made to the **Toggle Favorite** endpoint.
  * Default: 0
* **steps** – An `Array` of Steps, which are a separate database entity and managed through the `/api/how-to/:howToId/steps` endpoints
* **tags** – An `Array` of `String`s
* **title** – A `String` that is the title of the How To


### Add How To – `POST /api/how-to/`
Add a new How To.

#### Request Body
* **authorID** – required: `true`, must be a valid userID
* **tags** – required: `false`
* **title** – required: `false`, unique: `false`

#### Response
* **201** – Successful How To creation
  * Response body includes newly saved How To object
* **400** – Invalid request
* **404** – Invalid `authorID`

### Get How To List – `GET /api/how-to/`
Retrieve a list of all How Tos. Please let me know if you'd prefer a limited number of records to be retrieved.

#### Request Body
N/A

#### Response
* **200** – Successful query
  * An `Array` of How To `Object`s, returns an empty `Array` if no records in database

### Get How To by ID – `GET /api/how-to/:howToId`
Retrieve a How To by its ID. This route also populates the `author` field with the actual `user` record, rather than the user's ID.

The `/:howToId` in the URL refers to the `id` of the How To being requested.
For example: `/api/how-to/5cb796bf888e2408e065b4b2`

#### Request Body
N/A

#### Response
* **200** – Successful query
  * A How To `Object`, with the `author` field populated by the corresponding `user` `Object` instead of just the user ID
* **404** – Invalid How To `_id`

### Get How To by Author – `GET /api/how-to/author/:userId`
Retrieve a list of How Tos authored by a user.

The `/:userId` in the URL refers to the `id` of the How To being requested.
For example: `/api/how-to/author/5cb7772be50f7f07a1626ed3`

#### Request Body
N/A

#### Response
* **200** – Successful query
  * Response body includes an `Array` of How To `Object`s
* **404** – Invalid `userID`

### Edit How To – `PUT /api/how-to/:howToId`
Edit an existing How To.

The `/:howToId` in the URL refers to the `id` of the How To being edited.
For example: `/api/how-to/5cb796bf888e2408e065b4b2`

#### Request Body
* **authorID** – Required: `false`
  * Must be a valid `userID`
* **tags** – Required: `false`
  * Must be an `Array` of `String`s
  * Will overwrite the existing `tag` `Array`
* **title** – Required: `false`
If there are some other fields you'd like to be able to edit, please just let me know.

#### Response
* **200** – Successful edit
  * Response includes the newly updated record
* **400** – Invalid request
* **404** – Invalid How To `_id` or invalid `userID`

### Delete How To – `DELETE /api/how-to/:howToId`
Delete a How To.

The `/:howToId` in the URL refers to the `id` of the How To being deleted.
For example: `/api/how-to/5cb796bf888e2408e065b4b2`

This action cannot be undone.

#### Request Body
N/A

#### Response
* **204** – Successful delete, no response body sent
* **404** – No record found for `/:howToId`

### Toggle Favorite – `POST /api/how-to/:howToId/favorite`
Toggle the favorite status for a user and How To.

The `/:howToId` in the URL refers to the `id` of the How To being favorited.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/favorite`

#### Request Body
* **isFavorite** – Required: `true`
  * A `Boolean` indicating whether the user is adding or removing the favorite; this helps to ensure synchronicity between the front- and back-ends.
* **userId** – Required: `true`
  * The user doing the favoriting or un-favoriting

#### Response
* **200** – Will respond with a `200` even if the status did not change
  * **favoriteChange** – Indicates whether change occurred
    * **added** – How To was favorited
    * **removed** – How To was unfavorited
    * **null** – No change because the request `isFavorite` already matched database
  * **favoriteCount** – New total after changes
* **400** – Invalid request
* **404** – No record found for `/:howToId`

### Edit How To Image – `PUT /api/how-to/:howToId/image`
Edit the `image` property of the How To.

The `/:howToId` in the URL refers to the `id` of the How To being edited.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/image`

#### Request Body
* **image** – Required: `true`
  * The image URL

#### Response
* **200** – The How To was successfully edited
  * Response includes the updated How To record
* **400** – Invalid request
* **404** – No record found for `/:howToId`