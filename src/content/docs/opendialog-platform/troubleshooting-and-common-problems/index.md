---
title: Troubleshooting and Common Problems
---

Q: I get a "check your behavior" error in the player

![](~/assets/2023-06-14-16-31-02.png "188")

A: Check that you don't have two of the same type of intents following one another, e.g. an app intent followed by an app intent.

Check that your components have the correct behavior, e.g. starting and open behaviors.

Q: I created my intent in the conversation designer but I can't find it when I'm in a button block.

![](~/assets/2023-06-14-13-08-01-copy.png)

A: Check that you defined the intent as a user intent. App intents won't show up since the button requires a user intent.

Q: Do I need virtual intents to move from a button block to the next prompt (app intent)?

A: A button block allows you to add a message to your app intent and indicate buttons and labels. For each button, you need to indicate the USER intent that the button goes to. In other words, for each button we need a user intent to capture that the user clicked that button. From that user intent you then move to the next app intent, so no virtual intent is needed.

E.g.

A: Do you want to confirm or change your appointment? \[buttons in the app intent for "confirm" and "change"]

U: Confirm \[user clicks confirm. The system moves to the user intent that is indicated for that button in the app intent]

A: Ok, great.... \[from the user intent, the system moves to the next app intent through the typical mechanisms (e.g. intent in same turn, transition, ...).

![This button shows the details of the button block in the message editor and selection of user intent for each button.](~/assets/2023-06-16-07-32-11.png)

*Details of the button block and selection of user intent for each button*
