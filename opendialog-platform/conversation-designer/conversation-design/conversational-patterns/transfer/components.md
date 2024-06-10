# Components

### **Transfer triggers**

These are some of the events that commonly trigger a transfer.

* **User preference**. This could be the user indicating a desire to talk to a human, either by tapping a button or speaking/writing that intention.
* **User sentiment**. If the user is perceived to be unhappy/frustrated/angry/annoyed, you may want to offer the option of transferring to talk to a human.
* **Criticality of the conversation**. The conversation is critical for some reason, you may want to transfer to a human or other more sensitive interface option. Examples of critical could be a sensitive topic, a high-value interaction, a risk of churn, the interaction dragging on for a long time, or the user being in a special category.
* **Complex issue, fallback option**. If the bot can’t handle something, there is the option to escalate to a human.
* **Admin/agent oversight**. If the bot interactions are being monitored, a moderator may recognize a need for human intervention and take over.

### **Transfer** procedure

When initiating a transfer pattern, there are some common steps.&#x20;

* Tell the user that a handoff is coming
* Collect any remaining information so bot knows who to hand off to
* Some choices for the transfer destination
  * A human OR a bot
  * Synchronous OR asynchronous. Usually synchronous is preferred.
    * Common synchronous channels: chat, WhatsApp, FB messenger, phone
    * Common asynchronous channels: email
  * The bot OR the user chooses
* [Routing conditions](https://www.affinsys.com/Seamless-Bot-to-agent-hand-off):
  * Round-robin: assign user to the first available agent
  * Language-based: assign user to an agent with matching language preference
  * Skills-based: assign user to an agent with the skills matching the user's need

### **Wait phase (if needed)**

When a transfer is initiated, there may not be any agents available immediately. In this case, the user is put in a queue, and would benefit from clear communication on how long they are likely to have to wait and their position in the queue. This can help manage expectations. Transparency is key to user satisfaction, and “time-fillers” might help too. The Liz bot shows one example of how to handle waiting:

<figure><img src="../../../../../.gitbook/assets/Screen Shot 2022-02-17 at 11.15.00 AM.png" alt="" width="228"><figcaption></figcaption></figure>

This example shows estimated waiting time, position in the queue, and even offers the user the option of filing a ticket as an alternative to continuing to wait.

### **The actual handoff**

In a bot-to-human handoff, the human takes over. In such a case, the human needs to be trained to handle the transfer smoothly as well. While the human agent may be new to the conversation, the user has been there for a while. The user's experience can be improved if the human agent is given contextual information like the dialog history, the handoff trigger, user info (what product they use, demographics, geolocation), tips for how to help the user, and sample statements.

## **Examples**

Below are some screenshots of transfer experiences. To start, this LiveChat bot uses failure to understand user intent as a trigger for a transfer. After two fails, the transfer to a LiveChat agent is initiated.

![](https://lh4.googleusercontent.com/-fephlS1GFh1wzSgufd-uu4ThG6VQpDWYhaH5GwXdwROsVevRRHhzDL6r9zM62ZioggzAR6D9nvrPSkRviHi3TX2WWFAmQBucfE78lM1IpCPD\_Wx8WgfNZqFlF6BfjONyAKTFhrI)

The Lowe’s bot responds to a different trigger to initiate a handoff, namely when the user expresses an interest in a specific product. It doesn’t ask if the user wants to transfer to a human agent. Generally, we recommend giving users the option to transfer or not.

<img src="https://lh3.googleusercontent.com/t28Gx24JuifHuABQfepGxzNbsNgshAbMjh8TQCszInsvn43Vyk79XUYUJbsMbY6-LNeNF_6epbm8Dxk9qd56jiWxBRbb7POPY62A1q3ncyw9-ciXWro0_gWsdHtv8WW_hmQ7Bleo" alt="" data-size="original">

The health tech company Sensely has a symptom checker that offers transfer options after completing triage. Once the symptom has been assessed, the user is offered a list of options for next steps, including a nurse line, a callback service, and appointment booking for either a video or in-person visit.

![](https://lh4.googleusercontent.com/81FVqdrfg4PWunqvKsJWPi6nTzFvkJHYnYhZJhF4bCQrrqBGqXhQVbknaXXUBn23SSJNRpszgxoPYUX\_0D9NA3w6yyFLGNozhBrDPGggNoNl7UCzjjxhGlH8XoUxSY\_7Kh9lR5LG)

It may not always be clear to the user whether or not they are talking to a bot or a human. As an example, Liveperson’s home page normally triages with a bot, but one day the system was down and so a human was covering it.

![](https://lh3.googleusercontent.com/7i5kHbb6tuzuMotTBTN0ZSVd-N4kKyvkumfZJaLlS-tCxtwK65fq5kIAh7AoHd14JGIIjy8eRQSfAUqBsvdtp7PFwNHt6IbXjIoraG12XPv2V8gSOf\_63pUzz-t7EpNgzP6V\_7cO)![](https://lh6.googleusercontent.com/PQw7t1nDhx5ulOhyk65r4fsHid7PhW2XCeMH8lNtWoWHlY2q8EDeB0TMEKM6dvdldxzHpGbxbFxAY6ktQ\_Mxnb-tP\_bfMG4fypE9x2oAiS195CEFj2c-GLZh1hFF3XDBo6OdXPmm)

At the end, the human initiates a transfer to another human.&#x20;
