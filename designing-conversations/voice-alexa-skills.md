# Voice Alexa Skills

## What are voice Alexa skills?

Voice Alexa Skills are Alexa applications and conversation pathways which can be created in OpenDialog. They allow interactions through the Alexa platform and device.&#x20;

## How is the Alexa Skill Designer Package activated in OpenDialog?

The Alexa skill designer interface is not activated by default. To activate it, email support@opendialog.ai requesting to have the interface activated and specify which workspace you would like to have it activated in.&#x20;

Once it is activated, Alexa Skill will appear in the Scenario/Project creation menu under "Interface"

NOTE: you must also select a Locale.

<figure><img src="../.gitbook/assets/Screenshot 2023-06-12 163659.png" alt="Creating an Alexa skill project" width="240"><figcaption><p>Creating an Alexa skill project </p></figcaption></figure>

## Alexa Skill versus Webchat

There are some differences in the OpenDialog platform when designing an Alexa Skill versus a webchat.

1. NLUs. NLUs are no longer a concern in any way. The custom Alexa NLU is in use, and to function at full efficiency, this cannot be turned off.&#x20;
2. Testing. Testing can occur inside the OpenDialog platform, although it has changed to reflect the Alexa Skill being designed. It is also microphone accessible due to the verbal nature of the Alexa devices.&#x20;
3. Account Linking. To preview or test a Skill, even inside the OD platform, the creator must be linked into their Amazon Developer Account.&#x20;
4. Syncing and Exporting. Unlike the normal OD platform, creators do not so much export as synchronize Skills. The completed skills are sent to the Amazon Developer Account and a copy is created in the account that preforms exactly as the OD version does.
5. Continuing Linkage. Unlike with the normal OD platform, The Alexa Skills remain linked after synchronization/exporting. This also means that A) they can be continually edited and altered after the exportation, and the Alexa Skill in the Amazon Developer Account will remain updated. B) If the OD Platform version of the skill is deleted updates will cease, and it will have to be fully recreated and resynchronized into a completely new skill to allow further updating.

## How to Create Voice Alexa Skills

* The Invocation is a user intent which is the very start of the conversation. From this point, the rest of the conversation plays out.
* When creating the various levels of the conversation, the Alexa Skill creation does not differ from the normal OD Platform. Things are created and act the same way as they would normally. Simply treat this as a normal conversation, only bearing in mind the invocation.&#x20;

For more details, contact us at support@opendialog.ai.&#x20;
