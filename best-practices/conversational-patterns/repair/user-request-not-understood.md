# User request not understood

One common reason for communication breakdown between humans and digital assistants is when the assistant does not understand the user's request. In this section we focus specifically on text-based assistants. The lack of understanding means that the meaning of the user's input could not be resolved by the assistant. In the case of voice assistants, there is an additional layer of possible misunderstanding where the speech recognition fails. The latter is out of scope for this page in particular and we focus on those situations where the assistant does not understand the meaning of the user's input.&#x20;

Let's talk about how it can happen that a user is not understood. The system takes an input from the user and maps that to an intent.&#x20;

That user input can be a button, in which case a proper conversation structure would have an intent that the button label is mapped to. This mapping is mandatory in OpenDialog. It is possible that the button label is mapped to the wrong intent. This is a bug that should be discovered in functional testing. In conclusion, it is not common to run into issues with buttons.&#x20;

A higher chance for failure is possible when the user inputs natural language, in other words, they type a message, either a request or answer to a question. If the system can't map the user input to an intent, we have a breakdown that needs to be repaired.&#x20;

There are a number of user actions that can result in this breakdown. One set of actions are done by the user in good faith, meaning they are cooperating in the conversation and hence also expect to be understood, but they are not:

* The user input is not covered in the system; the utterance is not added to any intent, so it can't be mapped. This is a very common reason for this issue (add longer term solution, e.g. analyze logs and improve)
* The user uses another language or their written language has severe grammatical and spelling mistakes. The system understands what it was told to understand, so if the system was built for English, it will not automatically understand another language. If the system was not trained on sentences with severe grammar and spelling issues, it may not understand the user.&#x20;
