# Using in OpenDialog

{% hint style="info" %}
As you learn about how to implement different patterns in OpenDialog please keep in mind that OpenDialog is a flexible model that can support a variety of different implementations. We urge conversation designers to use the indications below as a means to learn, be inspired or be unblocked but not as the canon of how things should be done in OpenDialog!
{% endhint %}

The information collection challenge has been met by many technology companies with slot-filling approaches, but it is not the only way. Google’s Dialogflow, for example, has implemented slot-filling as a dedicated component where one must fill the slots before continuing, an experience separate from the rest of the conversation. By contrast, OpenDialog treats slot-filling as just another contextualized variation on conversation, where each slot is a (required) exchange within a conversation or scene.

A benefit of the OpenDialog approach to information collection is that the conversation can support user questions outside of the slot-filling paradigm while information is being collected, and maintain the context. For example, say the user has said they want a large pepperoni pizza but hasn’t yet said what type of crust. While the system may be expecting the next slot to be filled, the user may have a seemingly unrelated question about the restaurant’s hours or delivery time or something else. To be able to handle such unexpected questions, the technology needs to be able to change context to answer the question and then pick up the information collection sequence where they left off. OpenDialog handles this gracefully with the contextual structure inherent to its architecture and the use of “virtual intents”.

Within OpenDialog you have a design choice to implement this collection pattern in a single scene or as a collection of scenes (with each piece of info as a separate scene). “Would you like a sweet or dry wine” – could be a single turn or a scene, depending on how much you need to do to “fill that slot”. A doc may need to explain this design choice in OpenDialog.
