---
description: This page describe where to use and find a date picker message type
---

# Date Picker Message

## What is a date picker message?

Date picker messages allow the user to choose a date from a graphical calendar interface within the chat window which is then saved to an attribute for further use. Date picker messages simplify the process of inputting dates in a consistent format. This can often be challenging if you need to constrain the range of dates you would like to accept as input, or if you are serving an international user base with differing date formats. \


<div align="center" data-full-width="true">

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-06-04 at 10.31.07.png" alt="" width="207"><figcaption><p>Users are prompted with a clickable input box.</p></figcaption></figure>

 

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-06-04 at 10.31.14.png" alt="" width="207"><figcaption><p>When clicked, a calendar appears</p></figcaption></figure>

</div>

As well as being able to just pick the date, the date picker message also has other options. For example:

<div>

<figure><img src="../../../../.gitbook/assets/Pick a time.png" alt="" width="188"><figcaption><p>Pick a time</p></figcaption></figure>

 

<figure><img src="../../../../.gitbook/assets/Pick a date and time.png" alt="" width="188"><figcaption><p>Pick a date and time</p></figcaption></figure>

 

<figure><img src="../../../../.gitbook/assets/Pick a year and month.png" alt="" width="188"><figcaption><p>Pick a month and year</p></figcaption></figure>

 

<figure><img src="../../../../.gitbook/assets/Pick a year.png" alt="" width="188"><figcaption><p>Pick a year</p></figcaption></figure>

</div>

* The month + year option
* The just-year option
* The date + time option
* The only-time option

To enable these different options, you simply have to add another line of code into the XML that's available at the [bottom of the page](date-picker-message.md#xml-snippet).&#x20;

## When to use a date picker message?

There are many different times when a date picker could be useful to use in your OpenDialog chatbot. For example, when trying to schedule an appointment. The date picker message would allow your users to pick a date and time easily and efficiently.

Other examples on when to use this message type include booking reservations, setting reminders,  and event registration. Also for inputting basic data or information, for example putting in date of birth.

## How to create a date picker message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Copy the [XML snippet](date-picker-message.md#xml-snippet) at the bottom of this page into the black box and your chat message will appear in the Preview panel.&#x20;

Fill in the template with the [properties](date-picker-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 8 (1).png" alt=""><figcaption><p>How to create a date picker message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Date Picker' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

#### XML Snippet

Remember to use only one of the options to indicate range.&#x20;

```xml
<date-message>
  <text>Date Text</text>
  <callback>date_callback</callback>
  <submit_text>Date Submit Text</submit_text>
  <no_past_dates>true</no_past_dates>
  <no_future_dates>false</no_future_dates>
  <max_date>today</max_date>
  <min_date>20200101</min_date>
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
  <min_date>20200101</min_date>
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
  <min_date>20200101</min_date>
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
  <min_date>20200101</min_date>
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
  <min_date>20200101</min_date>
  <attribute_name>date_attribute_name</attribute_name>
</date-message>
```

To see the regular date picker, you can either not include the \<format> tag at all, or you can add

```xml
<format>default</format>
```

#### Interaction with other message types

Date picker messages should come last in in your authored messages as the `<submit_text>` button advances the conversation. They can be combined with text, image and audio messages (seen in [this example](date-picker-message.md#when-to-use-date-picker-messages)).&#x20;

#### Properties

`<text>`  is the title that appears at the top of the calendar. This could be _Select Appointment_ or as simple as _Date_ for example.

`<callback>`  As with button messages, the callback parameter defines the user intent that is triggered when the user clicks the submit button. This should route the user to the next step in the conversation.

`<submit_text>` defines the text that appears on the button that advances the conversation.

To indicate range, use either `<no_past_dates>` and `<no_future_dates>` or `<min_date>` and `<max_date>` :

* `<no_past_dates>` and `<no_future_dates>` take boolean values and narrow the scope of dates that are displayed to the user in the calendar. These allow you to constrain the range relative to "today".
* `<min_date>` and `<max_date>` define the scope of available dates the user can select. The input format is `YYYY-MM-DD` ie. the 30th October 2019 would be `2019-10-30`. The `<max_date>` is the last/most recent date the user can select.&#x20;

`<attribute_name>` defines the attribute to which the chosen date is stored.

## How to use a date picker message

{% embed url="https://www.loom.com/share/53d8e69063d0411097b1d69c7e2fd71c?sid=b1533127-c688-4c93-ac8a-43003caccaa5" %}
Video demonstration on how to use the date picker feature within OpenDialog
{% endembed %}

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct a date picker message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
