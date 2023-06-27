# API Documentation for My Todo List App

This is the backend API for the Todo List application. This API enables users to create an account, login, and manage their todo items. Users can perform CRUD (Create, Read, Update, Delete) operations on their tasks.

This documentation provides information on the endpoints available, the expected request formats, and the responses.

This API is built using Node.js and Express, and follows RESTful principles.

## Authentication

Before users can interact with their tasks, they need to register for an account and their Login. User authentication is performed via email and password.

Upon successful login, the user is provided with an authentication token. This token must be included in the `Authorization` header in all requests to the task endpoints, as follows:

`Authorization: Bearer <token>`
