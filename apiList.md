# Devtinder Api's

## authRouter

- POST/signup
- POST/login
- POST/logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

## connectionRequestRouter

<!-- From Senders Point of View statuses should be interested or ignored-->

- POST/request/send/:status/:userId

<!-- From Recievers Point Of view statuses should be accepted,rejected -->

- POST/request/review/:status/:requestId

## userRouter

- GET/user/requests/recieved
- GET/user/connections
- GET/user/feed

## Status: ignored, interested, accepted, rejected
