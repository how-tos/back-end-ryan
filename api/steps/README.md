# `STEPS` Endpoints
## `/api/how-to/:howToID/steps`

### Schema – Steps
* **_id** – The database automatically creates an ID, note the underscore
* **text** – A `String` that is the Step's content.
  * Required: True
* **title** – A `String` that is the Step's title
  * Required: `true`

### Add Step – `POST /api/how-to/:howToID/steps`
Add a new Step to the How To.

The `/:howToID` in the URL refers to the `id` of the How To to which the Step is being added.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/steps`

#### Request Body
* **image** – required: `false`, image URL – will figure out how to do this automatically with file uploading
* **text** – required: `true`
* **title** – required: `true`, unique: `false`

#### Response
* **201** – Successful Step creation
  * Response body includes list of Steps for How To, including new addition
* **400** – Invalid request
* **404** – Invalid `howToID`

### Get Step List – `GET /api/how-to/:howToID/steps`
Retrieve a list of all Steps for the How To. Please let me know if you'd prefer a limited number of records to be retrieved.

The `/:howToID` in the URL refers to the `id` of the How To for which the Steps are being requested.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/steps`

#### Request Body
N/A

#### Response
* **200** – Successful query
  * An `Array` of Step `Object`s
  * Returns an empty `Array` if no records in database

### Edit Step – `PUT /api/how-to/:howToID/steps/:stepID`
Edit an existing Step.

The `/:howToID` in the URL refers to the `id` of the How To to which the Step belongs. The `/:stepID` refers to the `id` of the Step being edited.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/steps/c5b88ab7edb457073ae7e417`

#### Request Body
* **image** – required: `false`, image URL – will figure out how to do this automatically with file uploading
* **text** – required: `false`
* **title** – required: `false`, unique: `false`

#### Response
* **200** – Successful edit
  * Response includes the newly updated list of Steps for the How To
* **400** – Invalid request
* **404** – Invalid `howToID` or invalid `stepID`

### Delete How To – `DELETE /api/how-to/:howToID/steps/:stepID`
Delete a Step.

The `/:howToID` in the URL refers to the `id` of the How To to which the Step belongs. The `/:stepID` refers to the `id` of the Step being edited.
For example: `/api/how-to/5cb796bf888e2408e065b4b2/steps/c5b88ab7edb457073ae7e417`

This action cannot be undone.

#### Request Body
N/A

#### Response
* **204** – Successful delete, no response body sent
* **404** – No record found for `/:howToID` or `/:stepID`