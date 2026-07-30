---
title: Date Picker Message
description: This page describe where to use and find a date picker message type
---

## What is a date picker message?

Date picker messages allow the user to choose a date from a graphical calendar interface within the chat window which is then saved to an attribute for further use. Date picker messages simplify the process of inputting dates in a consistent format. This can often be challenging if you need to constrain the range of dates you would like to accept as input, or if you are serving an international user base with differing date formats. <br>

<div align="center" data-full-width="true">

![](~/assets/screenshot-2024-06-04-at-10-31-07.png)

*Users are prompted with a clickable input box.*

![](~/assets/screenshot-2024-06-04-at-10-31-14.png)

*When clicked, a calendar appears*

</div>

As well as being able to just pick the date, the date picker message also has other options. For example:

<div>

![](~/assets/pick-a-time.png)

*Pick a time*

![](~/assets/pick-a-date-and-time.png)

*Pick a date and time*

![](~/assets/pick-a-year-and-month.png)

*Pick a month and year*

![](~/assets/pick-a-year.png)

*Pick a year*

</div>

* The month + year option
* The just-year option
* The date + time option
* The only-time option

To enable these different options, you simply have to add another line of code into the XML that's available at the [bottom of the page](/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message#xml-snippet).

## When to use a date picker message?

There are many different times when a date picker could be useful to use in your OpenDialog chatbot. For example, when trying to schedule an appointment. The date picker message would allow your users to pick a date and time easily and efficiently.

Other examples on when to use this message type include booking reservations, setting reminders,  and event registration. Also for inputting basic data or information, for example putting in date of birth.

## How to create a date picker message

Date picker messages are set up by following two steps:

1. Creating a date picker message on an application intent
2. Setting up the corresponding user intent to move the conversation forward

### 1. Creating a date picker message on an application intent

![](~/assets/group-8-1.png)

*How to create a date picker message in the custom message block*

:::tip
* In your scenario management, navigate to the application intent you wish to create the date picker message for.
* In the yellow right-hand settings panel, view its basic settings.
* Click on the 'Edit Messages' button in the Design from the right hand panel and select Messages
* Go into the message that you want to add a message block to by clicking on its Edit icon (notebook with a pencil)
* Select add a 'Custom Message' block
* Select 'Date Picker' from the drop down
* Update the XML to the [XML format](/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message#xml-snippet) you need for your use case
:::

:::caution
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
:::

#### XML Snippet

Remember to use only one of the options to indicate range.

```xml
<date-message>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>2024-01-20</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

Each option from above has it's own unique line of code that will need to be added. All of the code you need is available to you blow:

For the **time picker**

```xml
<date-message>
  <format>only-time</format>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>2024-01-20</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

For the **date & time** **picker**

```xml
<date-message>
  <format>date-time</format>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>2024-01-20</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

For the **year picker**

```xml
<date-message>
  <format>only-year</format>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>2024-01-20</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

For the **month and year picker**

```xml
<date-message>
  <format>month-year</format>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>2024-01-20</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

To see the regular date picker, you can either not include the \<format> tag at all, or you can add

```xml
<format>default</format>
```

#### Interaction with other message types

Date picker messages should come last in in your authored messages as the `<submit_text>` button advances the conversation. They can be combined with text, image and audio messages (seen in [this example](/opendialog-platform/conversation-designer/message-design/message-types/date-picker-message#when-to-use-date-picker-messages)).

#### Properties

`<text>`  is the title that appears at the top of the calendar. This could be _Select Appointment_ or as simple as _Date_ for example.

`<callback>`  As with button messages, the callback parameter defines the user intent that is triggered when the user clicks the submit button. This should route the user to the next step in the conversation.

`<submit_text>` defines the text that appears on the button that advances the conversation.

To indicate range, use either `<no_past_dates>` and `<no_future_dates>` or `<min_date>` and `<max_date>` :

* `<no_past_dates>` and `<no_future_dates>` take boolean values and narrow the scope of dates that are displayed to the user in the calendar. These allow you to constrain the range relative to "today".
* `<min_date>` and `<max_date>` define the scope of available dates the user can select. The input format is `YYYY-MM-DD` ie. the 30th October 2019 would be `2019-10-30`. The `<max_date>` is the last/most recent date the user can select.

`<attribute_name>` defines the attribute to which the chosen date is stored.

### 2. Setting up the corresponding user intent

In your XML you have set a callback parameter which defines the user intent to be triggered.  This means that when the user will click on the 'Submit' button (button text defined in the \<submit\_text> parameter), the conversation engine will look for this callback intent in your conversation design setup.

To set this up, follow these steps:

:::tip
* In your scenario management, navigate to the scene of the application intent that you set the date picker message on.
* <mark style="color:red;">**Set the Priority Interpreter to 'OpenDialog' - Do not forget!**</mark>
* Create a 'Continue' Turn
* Create a user intent corresponding to the callback from your XML snippet (by default this is 'Continue')
* Set the interpreter to Default so that it will pick up on the OpenDialog interpreter you set on the Scene level.
* From here, either set up a corresponding application response intent for your confirmation message or transition to a different part of the convrsation via a transition.
:::

:::caution
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
:::

## How to construct a date picker message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](/opendialog-platform/conversation-designer/message-design/constructing-messages)page for more information.

:::note
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](/opendialog-platform/conversation-designer/designing-accessible-chatbots).
:::
