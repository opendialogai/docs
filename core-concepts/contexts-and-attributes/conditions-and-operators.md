# Conditions and operators

Conditions are a way that attributes can be used to shape the flow of the conversation. These conditions are essentially asking a question. If the answer to that question is yes, then the message is eligible for use in the conversation. The various questions being asked are called Operators.&#x20;

## Available condition operators

<table data-view="cards" data-full-width="true"><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td><strong>Is True</strong></td><td>Can be used with Boolean Attributes</td><td>Checks if Attribute value is equal to "True"</td></tr><tr><td><strong>Is False</strong></td><td>Can be used with Boolean Attributes</td><td>Checks if Attribute value is equal to "False"</td></tr><tr><td><strong>Equals</strong></td><td>Can be used with Integer, Float, and String Attributes</td><td>Checks if Attribute value is equal to a set value in the condition</td></tr><tr><td><strong>Not Equals</strong></td><td>Can be used with Integer, Float, and String Attributes</td><td>Checks if Attribute value is not equal to a set value in the condition</td></tr><tr><td><strong>Greater Than</strong></td><td>Can be used with any Attribute with a numerical value</td><td>Checks if Attribute value is greater than the set value in the condition</td></tr><tr><td><strong>Greater Than or Equal To</strong></td><td>Can be used with any Attribute with a numerical value. </td><td>Checks if Attribute value is greater than or equal to the set value in the condition</td></tr><tr><td><strong>Less Than</strong></td><td>Can be used with any Attribute with a numerical value</td><td>Checks if Attribute value is less than the set value in the condition</td></tr><tr><td><strong>Less Than or Equal To</strong></td><td>Can be used with any Attribute with a numerical value. </td><td>Checks if Attribute value is less than or equal to the set value in the condition</td></tr><tr><td><strong>Time Passed Equals</strong></td><td>Can be used with last_seen Attribute</td><td>Checks if last_seen Attribute is equal to the set value in the condition</td></tr><tr><td><strong>Time Passed Greater Than</strong></td><td>Can be used with last_seen Attribute</td><td>Checks if last_seen Attribute is greater than the set value in the condition</td></tr><tr><td><strong>Time Passed Less Than</strong></td><td>Can be used with last_seen Attribute</td><td>Checks if last_seen Attribute is less than the set value in the condition</td></tr><tr><td><strong>Is Not Set</strong></td><td>Can be used with any Attribute</td><td>Checks if the Attribute does not have a value set</td></tr><tr><td><strong>Is Set</strong></td><td>Can be used with any Attribute</td><td>Checks if the Attribute does have a value set</td></tr><tr><td><strong>Is Empty</strong></td><td>Can be used with any Attribute</td><td>Checks if the Attribute does not have a value</td></tr><tr><td><strong>Is Not Empty</strong></td><td>Can be used with any Attribute</td><td>Checks if the Attribute value does have a value</td></tr><tr><td><strong>In Set</strong></td><td>Can be used with String Attributes</td><td>Checks if the Attribute value includes the text value set in the condition</td></tr><tr><td><strong>Not In Set</strong></td><td>Can be used with String Attributes</td><td>Checks if the Attribute value does not include the text value set in the condition</td></tr><tr><td></td><td></td><td></td></tr></tbody></table>

## Multiple conditions with operators

You can chain or group multiple conditions (two or more) together and apply them to any Conversation Object or Message Template, enabling validation through an operator. Currently, the supported operators for chaining conditions are **And** and **Or**.

By default, the operator for multiple conditions is set to **And**.

#### **Example**

Let’s consider an example with two conditions for a Conversation Object: `user_name` and `user_email`.

* **And Operator**: If the operator is set to **And**, the chained conditions will be true only when _both_ conditions are met. For instance, the object will be considered valid only if both `user_name` and `user_email` are set.

<figure><img src="../../.gitbook/assets/image (565).png" alt=""><figcaption><p>Conditions And operator</p></figcaption></figure>

* **Or Operator**: When the operator is set to **Or**, the chained condition will be true if _either_ of the conditions is met. In this case, the object will be valid if either `user_name` or `user_email` is set.

<figure><img src="../../.gitbook/assets/image (567).png" alt=""><figcaption><p>Conditions Or operator</p></figcaption></figure>

The above also applies to Message Templates.\


<figure><img src="../../.gitbook/assets/image (569).png" alt=""><figcaption><p>Message Template conditions OR operator</p></figcaption></figure>
