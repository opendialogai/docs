# Components

### User authentication status

* User is authenticated, accomplished behind the scenes via an integration (an action, not an intent)
* User is authenticated, just tried to authenticate conversationally and succeeded
* User is not authenticated and confronts an authentication trigger
* User is not authenticated, just tried to authenticate conversationally and failed

### Triggers for authentication

* Whole experience requires authentication, so this is triggered at the start of the interaction.
* Just-in-time authentication trigger examples
  * Entering secure chat
  * Asking for protected info
  * Initiating a transaction
  * Checking balances/due dates/credits

### Authentication conversation

* Explanation to user for why they need to authenticate
* Options if the user doesn’t want to authenticate.
  * Exit
  * Subset: only offer an experience not requiring authentication
  * Repair
  * Persuade: try to convince them it is worth authenticating
* Authentication procedure
  * Collect user info conversationally (e.g. username and password)
  * ​​If no account, then register
  * Link to external authentication page
  * Secret questions
  * Voice biometrics
* Optional: Explanation of authentication success or failure

### Embedded authentications (aka double authentication)

* You might authenticate at multiple levels. For example, a user could authenticate with the Alexa service, and then also authenticate with a skill within the Alexa service. A CapitalOne banking skill within Alexa might need to do this.
