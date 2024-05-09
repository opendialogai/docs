# Example dialog

In a Hospitality use case, a hotel guest may want a restaurant recommendation.

`Bot: I can recommend local restaurants for you. What kind of restaurant are you looking for?`

`User: Maybe an Italian restaurant nearby, not too expensive.`&#x20;

`Bot: It sounds like you’re looking for an Italian restaurant, within 5 miles, that is inexpensive. Is that right?`

`User: Yes.`&#x20;

`Bot: Great. One option is Bella Italia at 520 Main St., about a 5 minute walk from here. It gets good ratings and isn’t too expensive. How does that sound?`

`User: Seems good.`&#x20;

`Bot: If interested, I can book a reservation for you, or call them for you.`

`User: Let’s make a reservation for tonight at 7pm.`&#x20;

In this example, the system recommends the restaurant Bella Italia to the user. Before doing so, however, the system collected the relevant user preferences to be able to make such a recommendation. This process is documented in more detail in the Collecting Information pattern section, filling slots for things like type of food, location and cost. Once those slots are filled, the system has enough information to recommend a restaurant.

In this sample, the user accepts the system’s recommendation, and the conversation moves on to making a reservation. If the user had declined the reservation, the system could make another recommendation or ask for more user preferences. This could include asking for why that recommendation wasn’t a fit, e.g. it was too expensive. With this extra information, the system can refine its recommendations.
