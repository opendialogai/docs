---
description: >-
  There are data layer variables pre-set within WebChat to enable user tracking
  data to be passed into Tag Manager and then into Google Analytics instances.
---

# User Tracking

If you have a `dataLayer` variable defined on the page that the OpenDialog bot lives on, a number of events that happen in the chatbot will be passed to it as the bot is used.

### Events&#x20;

The current list of events sent:

#### Chatbot Events

These are triggered by the user open/closing or interacting with the chat window

* `chat_displayed` -  Triggered when the chat is first displayed to the user
* `chatbot_minimized`-  Triggered when the chatbot is minimised
* `chatbot_maximized`-  Triggered when the chatbot is opened
* `download_chat_transcript`-  Triggered when the user downloads the transcript, if the option if available.
* `end_chat` -  Triggered when the user clicks on the 'end chat' link
* `confirm_end_chat`-  Triggered when user clicks on 'yes' after the clicking on 'end chat'
* `url_clicked` (along with `url clicked` and `text`) -  Triggered when a user clicks on an outboard link.

#### Message Events

These events related directly to messages sent from the user or the chatbot

* `form_submitted` (along with `callback_id`and `message text`) -  Triggered when the user submits a form.
* `form_cancelled` (along with `callback_id`) -  Triggered when the user cancels a form submission.
* `user_clicked_button_in_chatbot` (along with `label`) -  Triggered when the user clicks on any button within the chatbot.
* `message_sent_to_chatbot` -  Triggered each time the user interacts or responds to the chatbot&#x20;
* `message_received_from_chatbot` (along with `message id`) -  Triggered each time the chatbot sends a message.



{% hint style="info" %}
The 1.0 version is currently in development - we will be adding more as we go on!
{% endhint %}

