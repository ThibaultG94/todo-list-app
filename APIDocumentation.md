# API Documentation for My Todo List App

This is the backend API for the Todo List application. This API enables users to create an account, login, and manage their todo items. Users can perform CRUD (Create, Read, Update, Delete) operations on their tasks.

This documentation provides information on the endpoints available, the expected request formats, and the responses.

This API is built using Node.js and Express, and follows RESTful principles.

## Authentication

Before users can interact with their tasks, they need to register for an account and their Login. User authentication is performed via email and password.

Upon successful login, the user is provided with an authentication token. This token must be included in the `Authorization` header in all requests to the task endpoints, as follows:

`Authorization: Bearer <token>`

## Endpoints

### User Endpoints

#### User Registration

-   **URL** : `/users/register`
-   **Method**: `POST`
-   **Description**: Register a new user.
-   **Request body**:

    | Field      | Type   | Description                                  |
    | ---------- | ------ | -------------------------------------------- |
    | `email`    | string | User's email address.                        |
    | `password` | string | User's password.                             |
    | `username` | string | User's usersame.                             |
    | `role`     | string | User's role (e.g., user, admin, superadmin). |

-   **Success Response**:

    -   **Code**: `201 Created`
    -   **Content**: `{ "message": "Account created", "user": <User Object> }`

-   **Error Responses**:

    -   **Code**: `400 Bad Request`
    -   **Content**: `{ "message": "Email already in use. Please change email address or login." }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Error registering account" }`

#### User Login

-   **URL** : `/users/login`
-   **Method**: `POST`
-   **Description**: Login a user.
-   **Request body**:

    | Field      | Type   | Description           |
    | ---------- | ------ | --------------------- |
    | `email`    | string | User's email address. |
    | `password` | string | User's password.      |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "Authentication successful", "token": "<User token>", "user": {"id": "<User ID>", "username": "<User username>", "email": "<User email>"} }`

-   **Error Responses**:

    -   **Code**: `401 Unauthorized`
    -   **Content**: `{ "message": "Invalid password" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "User not found" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

#### User Update

-   **URL** : `/users/:id/update`
-   **Method**: `PUT`
-   **Description**: Update a user.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    | Parameter | Type       | Description              |
    | --------- | ---------- | ------------------------ |
    | `id`      | `ObjectId` | ID of the user to update |

-   **Request body**:

    | Field      | Type   | Description                      |
    | ---------- | ------ | -------------------------------- |
    | `email`    | string | (Optional) User's email address. |
    | `password` | string | (Optional) User's password.      |
    | `username` | string | (Optional) User's username.      |
    | `role`     | string | (Optional) User's role.          |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "User updated", "user": "<User Object>" }`

-   **Error Responses**:

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have sufficient rights to perform this action" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "User not found" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

**Notes**:

    1. The user himself or an `admin` or `superadmin` can update the user's data.
    2. A non-superadmin user cannot update an `admin` or `superadmin` user's data.
    3. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

#### User Deletion

-   **URL** : `/users/:id/delete`
-   **Method**: `DELETE`
-   **Description**: Delete a user.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    | Parameter | Type       | Description              |
    | --------- | ---------- | ------------------------ |
    | `id`      | `ObjectId` | ID of the user to delete |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "User deleted", "user": "<User Object>" }`

-   **Error Responses**:

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have sufficient rights to perform this action" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "User not found" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. Only the user himself or an `admin` or `superadmin` can delete the user's account.
    2. A non-superadmin user cannot delete an `admin` or `superadmin` user's account.
    3. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

#### Get User Information

-   **URL** : `/users/:id/account`
-   **Method**: `GET`
-   **Description**: Retrieve information about a user.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    | Parameter | Type       | Description                |
    | --------- | ---------- | -------------------------- |
    | `id`      | `ObjectId` | ID of the user to retrieve |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "user": "<User Object without password>" }`

-   **Error Responses**:

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have sufficient rights to perform this action" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "User not found" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A user can only request his own data, unless they are `admin` or `superadmin`.
    2. An `admin` can request the data of any user, except for other `admin` and `superadmin` user's.
    3. A `superadmin` can request data from any user.
    4. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

#### User forgot his password

-   **URL** : `/users/auth/forgot-password`
-   **Method**: `POST`
-   **Description**: Reset password with email adress

-   **Request body**:

    | Field   | Type   | Description           |
    | ------- | ------ | --------------------- |
    | `email` | string | User's email address. |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "Email sent" }`

-   **Error Responses**:

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "No account with that email address exists" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

### Task Endpoints

#### Get Task Information

-   **URL** : `/tasks/:id`
-   **Method**: `GET`
-   **Description**: Retrieve information about a specific task.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    | Parameter | Type       | Description                |
    | --------- | ---------- | -------------------------- |
    | `id`      | `ObjectId` | ID of the task to retrieve |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "<Task Object>" }`

-   **Error Responses**:

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have sufficient rights to perform this action" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "This task does not exist" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A user can only retrieve tasks that they have created.
    2. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

    #### Get User's Tasks

-   **URL** : `/tasks/user/:id`
-   **Method**: `GET`
-   **Description**: Retrieve all tasks associated with a specific user.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    | Parameter | Type       | Description                          |
    | --------- | ---------- | ------------------------------------ |
    | `id`      | `ObjectId` | ID of the user to retrieve tasks for |

-   **Query Parameters**:

    | Parameter | Type     | Description                | Default |
    | --------- | -------- | -------------------------- | ------- |
    | `page`    | `Number` | Page number for pagination | 1       |
    | `limit`   | `Number` | Number of tasks per page   | 10      |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `[ "<Task Object>" ]`

-   **Error Responses**:

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have sufficient rights to perform this action" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "This task does not exist" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A user can only retrieve their own tasks.
    2. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.
    3. This endpoint uses caching. If the tasks are in cache, they will be retrieved from ther, oserwise, they will be retrieved from the database and then cached for future requests.

    #### Set Task

-   **URL** : `/tasks`
-   **Method**: `POST`
-   **Description**: Create a new task.
-   **Authorization**: `Bearer <JWT>`

-   **Request body**:

    | Field         | Type   | Description                     |
    | ------------- | ------ | ------------------------------- |
    | `title`       | string | Title of the task.              |
    | `userId`      | string | User's ID who created the task. |
    | `date`        | number | Due date of the task.           |
    | `description` | string | Description of the task.        |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "task": "<Task Object>" }`

-   **Error Responses**:

    -   **Code**: `400 Bad Request`
    -   **Content**: `{ "message": "Please add a task" }`

    or

    -   **Code**: `404 Not Found`
    -   **Content**: `{ "message": "The specified user does not exist" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A task can be only created by a logged-in user, who is then associated with the task.
    2. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.
    3. When a new task is created, all cached task keys for this user are invalidated.

    #### Edit Task

-   **URL** : `/tasks/:id`
-   **Method**: `PUT`
-   **Description**: Update an existing task.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    -   `id` : ID of the task to update.

-   **Request body**:

    | Field         | Type   | Description                     |
    | ------------- | ------ | ------------------------------- |
    | `title`       | string | Title of the task.              |
    | `userId`      | string | User's ID who created the task. |
    | `date`        | number | Due date of the task.           |
    | `description` | string | Description of the task.        |

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "Task updated", task": "<Task Object>" }`

-   **Error Responses**:

    -   **Code**: `400 Bad Request`
    -   **Content**: `{ "message": "This task does not exist" }`

    or

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have the right to modify this task" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A task can only be updated by the user who created it.
    2. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

#### Delete Task

-   **URL** : `/tasks/:id`
-   **Method**: `DELETE`
-   **Description**: Delete a task.
-   **Authorization**: `Bearer <JWT>`

-   **URL Parameters**:

    -   `id` : ID of the task to update.

-   **Success Response**:

    -   **Code**: `200 OK`
    -   **Content**: `{ "message": "Task deleted `req.params.id`", }`

-   **Error Responses**:

    -   **Code**: `400 Bad Request`
    -   **Content**: `{ "message": "This task does not exist" }`

    or

    -   **Code**: `403 Forbidden`
    -   **Content**: `{ "message": "You do not have the right to modify this task" }`

    or

    -   **Code**: `500 Internal Server Error`
    -   **Content**: `{ "message": "Internal server error", "result": "<Error Details>" }`

    **Notes**:

    1. A task can only be deleted by the user who created it.
    2. The `Authorization` header should contain a valid JWT token in the format `Bearer <JWT>`.

## Common Errors

The API uses conventionnal HTTP response codes to indicate the success or failure of an API request.

-   `200 OK`: The request was successful.
-   `201 Created`: The request was successful, and a resource was created as a result.
-   `400 Bad Request`: The server could not understand the request due to invalide syntax.
-   `403 Forbidden`: The client does not have access rights to the content.
-   `404 Not Found`:The server can not find the requested resource.
-   `500 Internal Server Error`: The server has encountered a situation it doesn't know how to handle.
