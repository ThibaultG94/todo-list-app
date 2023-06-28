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

-   **URL** : `/user/register`
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

-   **URL** : `/user/login`
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

-   **URL** : `/user/:id/update`
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

-   **URL** : `/user/:id/delete`
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

-   **URL** : `/user/:id/account`
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

## Common Errors

The API uses conventionnal HTTP response codes to indicate the success or failure of an API request.

-   `200 OK`: The request was successful.
-   `201 Created`: The request was successful, and a resource was created as a result.
-   `400 Bad Request`: The server could not understand the request due to invalide syntax.
-   `403 Forbidden`: The client does not have access rights to the content.
-   `404 Not Found`:The server can not find the requested resource.
-   `500 Internal Server Error`: The server has encountered a situation it doesn't know how to handle.
