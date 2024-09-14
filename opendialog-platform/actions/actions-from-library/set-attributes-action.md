# Set Attributes Action

The Set Attributes action allows you to perform an action that will set the value of one or more attributes.&#x20;

There are a number of reasons you may want to explicitly set some attribute values. For example:

* Setup some test data at the start of your conversation without calling out to APIs or other complex scenarios.
* Initialise attributes during the conversation so that they can be reused.&#x20;

The Set Attributes action is available through the Custom Actions Component ID dropdown.

<figure><img src="../../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

It is configured by configuring it's JSON structure.&#x20;

The attribute value map identifies the name of the attribute and the value it should have, while the context attribute map tells us in which context should that attribute be set to the specific value.&#x20;

The example below shows how we would set the value of two attributes starter\_bot\_global\_no\_match\_count and starter\_bot\_chat\_started to specific values within the User context.&#x20;

<figure><img src="../../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>



