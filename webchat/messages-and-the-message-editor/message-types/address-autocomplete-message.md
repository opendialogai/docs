---
description: This page describes where to use and find an address autocomplete message type
---

# Address Autocomplete Message

## What is an address autocomplete message?

An address autocomplete message type in a chatbot is a feature that assists users in quickly entering their address information by providing real-time suggestions as they type. This type of message aims to enhance the user experience by reducing the amount of typing required and ensuring more accurate address entries.

Using address autocomplete can significantly enhance the efficiency and user-friendliness of a chatbot, particularly in scenarios where precise address information is crucial

## When to use an address autocomplete message

Address autocomplete message types can be useful to use in your OpenDialog chatbot when users need to enter address information accurately and efficiently. Some example instances where this message may be beneficial include when customers need to provide their address for service requests, returns, or troubleshooting issues. Or during account creation or profile updates, users can enter their address details accurately.

It can be utilised for different purposes across various different industries. For example, in healthcare, when booking appointments, patients can enter their address for home visits or correspondence. Or when scheduling installations or repairs with their car provider, users can quickly enter their address.

## How to create an address autocomplete message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `address-autocomplete-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties](address-autocomplete-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Group 30.png" alt=""><figcaption><p>How to create an address autocomplete message via a custom message</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'address auto complete' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

```xml
<autocomplete-message>

-- THIS MUST BE THE LAST MESSAGE IN THE LIST TO WORK AS EXPECTED -->
 <title>Title</title>
 <callback>callback.id</callback>
 <submit_text>Submit</submit_text>
  <options-endpoint>
    <url>https://api.craftyclicks.co.uk/address/1.1/find</url>
    <params>
      <param name="country" value="GBR" />
    </params>
    <query-param-name>query</query-param-name>
  </options-endpoint>
  <attribute_name>location</attribute_name>
  <google api_key="" />
  <fetchify
    api_key=""
    fetch_countries="true"
    retrieve_endpoint_url="https://api.craftyclicks.co.uk/address/1.1/retrieve"
    countries_endpoint_url="https://api.craftyclicks.co.uk/address/1.1/countries"
  />
</autocomplete-message>
```

## How to use an address autocomplete message

Tutorial video coming soon.

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct an address autocomplete message

When using an address autocomplete message with other message block types, these must be the very last in the list. &#x20;

{% hint style="info" %}
Note that the autocomplete message will cause the user input field to be taken over by an autocomplete modal.
{% endhint %}

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structuring these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
