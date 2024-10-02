---
description: >-
  Use the OpenDialog Analyse feature to make informed decisions about the past,
  present and future of your conversational application.
---

# Monitoring your application

This section explains how to track user interactions with your conversational application and identify trends in project usage.

The OpenDialog Analyse dashboard provides a comprehensive view of recent interactions, a log of the latest messages, and a high-level summary of usage patterns over time.

<figure><img src=".gitbook/assets/Screenshot 2024-09-26 at 10.28.52.png" alt=""><figcaption><p>The OpenDialog Analyse dashboard gives you an overview of the latest interactions with your application and a bird-eye overview of project usage over time.</p></figcaption></figure>

## **The basics**

Analyse lets you visualise your application's conversational data set, which you can use to improve your conversational application where needed.

It allows you to answer the following questions:

* How many conversations are happening by how many users?
* What is happening in the conversations?
* Which conversations had errors and where?
* What was the logic that led to specific conversational paths & errors?

Analyse provides you with a visualisation of the application's interaction logs, project usage over time, message logs, detailed conversational history per user, flow visualisation and dialogue management insights.

## **Analyse in action**

#### Actionable insights

Viewing specific conversations and their logic, you can make informed decisions and improve your application's user experience.

#### Application health

By viewing the number of fallbacks and filtering conversations based on them, you can check your application's health and identify improvement areas.

#### Diagnose & improve discovery

By viewing the number of users that started a conversation and the number of conversations per user, you can diagnose any discoverability & desirability issues and fix them.

#### Monitor ROI

By visualising usage trends, you can see the evident uptake or downturn in the number of users and expand or improve the application's use case accordingly.

## **Where to find**

Analyse allows you to explore how your application has been performing. It is, therefore, part of the testing suite of a given scenario.

<figure><img src=".gitbook/assets/Group 2 (3).png" alt=""><figcaption><p>You can find Analyse, in the Test section of your scenario menu.</p></figcaption></figure>

{% hint style="success" %}
To access the Analyse dashboard:

* Navigate to your workspace dashboard
* Select a scenario
* Using the left-hand sidebar menu, expand the 'Test' section
* Select 'Analyse'
{% endhint %}

## **Structure**

To use the Analyse feature within OpenDialog, navigate to the 'Analyse' dashboard within the sidebar, where you can review, explore, and expand different data snapshots of your application.

Analyse has three main components: project usage, interaction logs, and message log table:

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td><a href="monitoring-your-application.md#project-usage"><mark style="color:purple;"><strong>Project usage</strong></mark></a></td><td>The project usage graph shows both the number of users and the number of requests for any given date or range of dates. It can also be expanded for a more focused and in-depth visualisation.</td><td></td><td><a href=".gitbook/assets/Screenshot 2024-09-26 at 10.32.32.png">Screenshot 2024-09-26 at 10.32.32.png</a></td></tr><tr><td><a href="monitoring-your-application.md#interaction-logs"><mark style="color:purple;"><strong>Interaction logs</strong></mark></a></td><td>The interaction logs are listed and filtered by date, with the most recent appearing at the top. Each interaction log can be expanded to review specific conversations.</td><td></td><td><a href=".gitbook/assets/Screenshot 2024-10-01 at 15.28.40.png">Screenshot 2024-10-01 at 15.28.40.png</a></td></tr><tr><td><a href="monitoring-your-application.md#message-table"><mark style="color:purple;"><strong>Message</strong></mark> </a><mark style="color:purple;"><strong>log table</strong></mark></td><td>The message logs are listed and filtered by date, with the most recent appearing at the top. Messages can also be filtered by Conversation, Scene, Turn and Intent to find specific results.</td><td></td><td><a href=".gitbook/assets/Screenshot 2024-09-26 at 10.38.51.png">Screenshot 2024-09-26 at 10.38.51.png</a></td></tr></tbody></table>

## **How to use**

### Project Usage

The project usage functionality allows you to visualise project usage trends over time.

<figure><img src=".gitbook/assets/Screenshot 2024-09-26 at 10.32.32.png" alt=""><figcaption><p>Expanded view of project use over the course of a week</p></figcaption></figure>

You can expand or minimize the project usage graph to your needs using the Expand/Collapse icons in the top right corner of your screen, depending on how focussed you wish the view to be.

Project usage can be viewed for a specific day, week, month or other selected date range via the date picker in the top right corner. This allows you to hone in on specific date ranges and check your conversational application's usage for that time.

This can be particularly useful, for example, if you have made specific changes to where your users can find your application, the call-to-action, or the conversational experience at a given time, and you wish to visualise and communicate its impact on the number of users.

### Interaction logs

The list of interaction logs allow you to visualise a list of conversations had by specific users, at a specific time and it's related data. Available data points per interaction log are `date & time` , `user-ID` , `timezone` , `platform` , `browser` , `number of fallbacks` in the conversation, and `number of messages` . Each of these can be used to sort through the interaction logs. We will specify the use of a few of them below.

In addition, you can use the date picker on the top of the screen to select conversations for a specific date range, or search the interaction log for a specific user-ID thanks to the user-ID search field in the top right corner.

<figure><img src=".gitbook/assets/Screenshot 2024-10-01 at 15.31.13.png" alt=""><figcaption><p>List of interaction logs</p></figcaption></figure>

<mark style="color:purple;">Date & time</mark> gives you an indication of the timestamps of users interacting with your application. Filtering by this field allows you to visualise the most recent conversations first or, on the other hand, the oldest conversations. In addition, the timestamp can help you identify a specific conversation for a user, in case you need to review it. Bearing in mind that an interaction spans over a period of time, the single value in the Date and Time column show us the date and time of the first message sent within an interaction (within the date range specified by the filters).

<mark style="color:purple;">User-ID</mark> indicates the user's unique user-ID which can help you identify a specific user. OpenDialog automatically generates a user-ID for each start of your application, if one is not provided. However, this user-ID can also be user-specific like user e-mails if your scenario is set up with this information.

You can also sort by <mark style="color:purple;">fallback</mark> to visualise which logs contain more fallbacks versus which ones did not. It will be interesting to dig further into those conversations with many fallbacks to identify areas of improvement for your conversational model or your language service.

The <mark style="color:purple;">number of messages</mark> will indicate how many exchanges a user had with your application within the provided date range. This can indicate users' engagement with your application and its capacity to retain users and help them accomplish their goals.

You can click through each item in the interaction log list to visualise its detailed conversation logs.

### Message log table

<figure><img src=".gitbook/assets/Screenshot 2024-10-01 at 15.31.33.png" alt=""><figcaption><p>List of message logs</p></figcaption></figure>

The message log table is an essential tool for reviewing and understanding the full history of conversations within your OpenDialog scenarios. Combined with its filtering capabilities, the table offers a powerful method for monitoring and analysing the flow of messages. It acts as a detailed log of every message exchanged between users and the application, providing valuable insights into the progression of conversations.

There is an export button in the top left hand side of the table. Clicking this button will export data with the current filters applied into a CSV file for you to download.

By examining this data, you can evaluate the performance of your application, identify patterns, and uncover potential areas for improvement.

**Columns in the message log table**

The table presents a variety of fields that categorise each message within your application:

<details>

<summary>Date and time</summary>

Indicates when the message was created

</details>

<details>

<summary>User ID</summary>

User-ID indicates the user's unique user-ID which can help you identify a specific user.

</details>

<details>

<summary><strong>Conversation, Scene, Turn and Intent</strong></summary>

Indicates where in your scenario this message was sent

</details>

<details>

<summary>Author</summary>

Specifies the message origin, which will be either user or system (your application).

</details>

<details>

<summary>Type</summary>

Indicates the message type, such as text, image, or button.

</details>

<details>

<summary>Message</summary>

Displays the actual content of the message, either from the user or the system. This is where you can review exactly what was communicated in each turn of the conversation.&#x20;

</details>

#### **Filtering Messages**&#x20;

<figure><img src=".gitbook/assets/Screenshot 2024-10-01 at 15.32.22.png" alt=""><figcaption><p>By using the breadcrumb filter, you can narrow down you search by conversation, scene, turn and intent</p></figcaption></figure>

There are many different ways to filter the message log table to find exactly what you are looking for. You can filter by date and time by clicking on the calender and selecting the specific time frame you would like to filter the messages by.

You can also filter your messages based on User ID. To do this, you can start to manually type in a User ID into the search bar. Or, you can click on the User ID attached to a certain message in the table and this will populate the search bar with this User ID for you.

Another way you can filter the table is with the preview filter. This allows you to select what type of messages you would like to view in your message log table.  There are three different options to choose from:

* <mark style="color:purple;">**Preview data -**</mark> this filters all the messages that have been generated using the 'Preview' application internally within OpenDialog
* <mark style="color:purple;">**Live data -**</mark> this filters all the messages that have been generated from a live conversation with a user
* <mark style="color:purple;">**All data -**</mark> this shows you all of the available data

The message log table includes a breadcrumb filter to make message analysis quicker and more effective. This feature allows you to filter the messages based on specific criteria, ensuring that you can narrow down the data to the most relevant interactions. The filter works in a hierarchical fashion, helping you to further investigate the data in a descending order:

1. <mark style="color:purple;">**Conversation**</mark>:\
   The first filter layer is the conversation itself, allowing you to isolate a particular session with a user. This is helpful when you want to analyse all messages associated with a single conversation from start to finish.
2. <mark style="color:purple;">**Scene**</mark>:\
   Once you've selected a conversation, you can further filter by scene. This allows you to examine messages within a particular phase of the interaction, providing context on how users move through the various stages of the conversation.
3. <mark style="color:purple;">**Turn**</mark>:\
   With scene filtering applied, you can then add an additional filter for specific turns. This level of filtering helps you focus on moments (where either the user or system sent a message) enabling you to further investigate the flow of interaction at a more granular level.
4. <mark style="color:purple;">**Intent**</mark>:\
   Intents display the exact message contents from either the user or the system, allowing you to review what was communicated within each turn of your conversation.

### **Detailed conversation logs**

The detailed conversational logs for each item in the interaction logs are composed of four sections:&#x20;

* The user details
* The conversational log history
* The conversational flow visualisation&#x20;
* The conversational logic logs&#x20;

<figure><img src=".gitbook/assets/created.png" alt=""><figcaption><p>Detailed conversation log, including user information, conversational history, conversational flow visualization, and conversational logic.</p></figcaption></figure>

<mark style="color:purple;">**User information**</mark> gives you a quick summary of the interaction log item you are viewing. You also have the option to copy the User-ID from here to search for further interaction logs by this same user in the interaction logs list.

The <mark style="color:purple;">**conversation logs**</mark> contain the entire conversational history for this interaction log, tracking back all user and application exchanges. You can use the 'play' button to visualize the individual exchanges and their logic in the middle panel of the screen. You can also view the intent details for each message by using the 'View intent details' toggle at the top of the Conversation Log section. If you see any issues with the displayed message, you can thus click on the linked intent and go edit the selected message.

The considered <mark style="color:purple;">**conversational paths**</mark> are displayed in the middle panel for the selected user-application exchange. You can play through them via the Play button on the conversational logs or walk through them step by-step to review the conversation engine logic by using the arrows at the bottom of the screen. This helps you to understand what incoming and outgoing intents, and messages were selected by the conversation engine and why. If any virtual intents were encountered within the request you are viewing, a further cycle of frames will be displayed. These frames will display the incoming and outgoing intents that were selected as a consequence of reaching the virtual intent.

Finally, the right-hand panel displays the <mark style="color:purple;">**conversational logic**</mark> behind the selected conversational paths, displaying the available, selected and rejected intents and the in-depth reasoning behind each decision made by the conversation engine. This is particularly useful to debug conversations and, for example, to better understand why certain user utterances might have caused an unexpected answer. The detailed conversational logic contains information regarding the [interpretation](opendialog-platform/interpreters-and-natural-language-understanding/) of the intents via the interpreters set up for your scenario, the passing of  on conversational components, the reasoning behind intent selection, transitions between conversational components and what are attributes are being saved during that interaction.&#x20;

## **Frequently asked questions**

**I need more granular data. How can I access this information?**

If you need more granular data, you can contact us via support@opendialog.ai.

**I do not see the conversational flow visualisation. Is this normal?**

Conversational flow visualisation is currently unavailable for exceptionally large scenarios. We are working on alternative visualisations to cater for those as well.

**I want to access the analytics data via an API rather than the OpenDialog application. How can I do this?**

The [Interaction API](developing-with-opendialog/interaction-api.md) enables retrieving information about interactions between the user and OpenDialog scenarios. The data is requested for over a time period ( `from` , `to` ) and is split by `user_id` . You can check out the Interaction API documentation through this [link](developing-with-opendialog/interaction-api.md).

**I got a warning message for the conversational flow visualization indicating 'No Request ID provided'. What does this mean?**

This can happen if the event storage was not active or turned off when the user made a request. In the future, you should not encounter this any more as this is related to the roll-out of the Analyse feature.
