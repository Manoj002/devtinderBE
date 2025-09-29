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

- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId
