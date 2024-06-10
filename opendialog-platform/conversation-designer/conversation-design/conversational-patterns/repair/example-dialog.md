# Example dialog

In a Hospitality use case, a hotel guest may want a restaurant recommendation. This is the example dialog from the Providing Recommendations pattern, but with a repair sequence inserted.

**`Providing Recommendations`**

`Bot: I can recommend local restaurants for you. What kind of restaurant are you looking for?`

`User: Maybe an I#&*$&#n restaurant nearby, not too expensive.`&#x20;

`Bot: It sounds like you’re looking for an Indian restaurant, within 5 miles, that is inexpensive. Is that right?`

**`Repair`**

`User: Mostly, but I asked for an Italian restaurant.`&#x20;

`Bot: Got it. So, an Italian restaurant, within 5 miles, that is inexpensive. Is that it?`

`User: Yes.`&#x20;

**`Providing Recommendations`**` ``(cont.)`

`Bot: Great. One option is Bella Italia at 520 Main St., about a 5 minute walk from here. It gets good ratings and isn’t too expensive. How does that sound?`

`User: Seems good.`&#x20;

`Bot: If interested, I can book a reservation for you, or call them for you.`

`User: Let’s make a reservation for tonight at 7pm.`&#x20;

In this sample, the user provided three pieces of information for use in providing a restaurant recommendation: cuisine, distance and cost. The bot heard the request for an “Indian” restaurant. When the bot seeks confirmation, the user corrects the error by indicating a desire for an Italian restaurant, not an Indian restaurant. The bot is able to accommodate the change and seek confirmation with the update. When the user confirms, the conversation continues. The repair is a brief side-sequence to correct an error in understanding.
