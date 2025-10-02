# Dev Tinder API List

## Auth user

- POST /signUp
- POST /login
- POST /logout
- POST /forgotPassword
- SSO

## User

- GET /feed
- GET /chats
- GET /connections

<!-- These both apis can be groped into a single api ==> GET /requests -->
<!-- - GET /connectionRequestsReceived.                 ]___>. GET /requests -->
<!-- - GET /connectionRequestSent                       ] -->

- GET /requests

## UserProfile

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/edit/password

## Connection

- POST /request/send/:status/:userId
- POST /request/send/:status/:userId
- POST /request/review/:status/:userId
- POST /request/review/:status/:userId
