# Example dialog

User is in the hotel lobby, not their hotel room, and wants to order room service. User talks to a kiosk voice bot. User not authenticated.

`[User launches the bot]`

_`Bot: Welcome to Hotel OpenDialog. How can I help you today?`_

`User: I’d like to have a bottle of Dom Perignon brought to our room at around 10pm this evening. Is that possible?`

_`Bot: I can have room service bring you a bottle of Dom Perignon at 10pm this evening. Is that what you’d like?`_

`User: Yes.`

_`Bot: Before completing this change, I’ll need to verify your information. What room are you in?`_

`User: Room 406.`

_`Bot: Room 406. And to confirm who you are, what is your credit card number?`_

`User: 1234 1234 1234 1234`

_`Bot: Thank you, Jason. You will receive your room service at 10pm tonight.`_

`User: Thank you.`

In the above interaction, the user is making a request for room service from a location where they are not authenticated. Purchasing room service is an authentication trigger. Once the user intent is confirmed, the bot collects user information conversationally. In this case, instead of a username and password, the bot asks for the user’s room number and credit card number. The bot can compare the credit card number on file for room 406 and confirm that they match, thus accomplishing the authentication. Once authenticated, the transaction (a room service request) can be completed.
