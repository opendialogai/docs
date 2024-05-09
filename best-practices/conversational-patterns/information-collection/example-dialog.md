# Example dialog

In this Hospitality use case, the user wants to make a restaurant reservation. The bot helps them do this by collecting the relevant information.

`Bot: I can help you make a reservation. Okay, so you’re looking for a reservation at Bella Italia, at 7pm tonight, is that right?`

`User: Yes.`

`Bot: Great. How many people will there be?`

`User: Four people`.

`Bot: Okay, a reservation for four at 7pm tonight at Bella Italia. Let me check with them.`

`[Bot checks availability]`

`Bot: It looks like there is nothing available then, but there is an opening at 7:30pm. How does that sound?`

`User: That works.`

`Bot: I can book it for you, using the same name as your hotel reservation, Jason Bourne. Shall I book it for you?`

`User: Yes.`

`[Bot books the reservation]`

`Bot: Done! You’re booked for a table for four at 7:30pm tonight at Bella Italia.`

`User: Oh, one question. Does Bella Italia have gluten free options?`

`Bot: Unfortunately, I don’t know the details of their menu, but I can call them for you if you’d like to ask directly. Shall I do that?`

`User: Yes please.`

`Bot: Sure thing, one second.`

This sample interaction includes direct information collection (How many people?), as well as repair (nothing available at requested time), and a transfer when the user asks a question the bot cannot answer. The information collection process is central to booking the reservation, but the associated patterns of repair and transfer are key to successfully managing the interaction.
