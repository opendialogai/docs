# Components

### Question

The simplest way to collect a piece of information is to just ask:

`Bot: Are you ready?`&#x20;

`User: Yes/No`

In this case, a single question/answer pair collects a single piece of information. But sometimes you need more than that.

### Slot-filling

With slot-filling, a single turn collects (potentially) many pieces of information. You might ask a question that has a lot of possible answers, and a lot of detail is needed to fully answer:

`Bot: What kind of pizza would you like?`

In this case, there are a number of relevant pieces of information you need to be able to fully define (and deliver) the desired pizza, including pizza size (S, M, L), type (thin, deep dish), toppings (olives, mushrooms), and more. You may know all of these categories ahead of time and simply need to make sure they are all answered. This calls for a slot-filling solution. The user can give an open-ended answer that can be analyzed to extract answers to each of the slots, and if a required slot is unfilled, then follow-up questions can directly query the relevant slots. For example:

`Bot: What kind of pizza would you like?` \
`User: A large pepperoni pizza. [slots: size, topping]` \
`Bot: Round or deep dish?` \
`User: Round [slots: type]`

An alternate approach to slot-filling would be directed dialogue, navigating the user through each slot one at a time without any open-ended inputs. For example:

`Bot: What size pizza would you like?` \
`User: Large` \
`Bot: What toppings?` \
`User: Pepperoni` \
`Bot: And round or deep dish?` \
`User: Round`

Both sample dialogues above collect the same information, but the first supports an open-ended input and requires an intelligent NLU to map the input to fill the slots. It then follows up with targeted questions to fill any remaining required slots. By contrast, the second dialogue forgoes any open-ended inputs and railroads the user into a step-through process to answer the questions the system knows are required. This approach is more controlled, easier to implement, but can feel unnatural or controlling to a user. It’s not how you would usually talk to a human.

Slot filling approaches to information collection depend on a user’s ability to accurately fill slots. That is, the conversation could prompt a user for the relevant pieces of information at the right time, but if the user is unable or unwilling to provide the right information, then the conversational goal won’t be met. For example, asking someone what kind of food they want may receive a reply like “not sure” or “something healthy”, which may not line up to existing categories. There are conversational cues however to the valence a user brings to their responses. In a study of dietary reporting, cues to problematic reporting include “it depends” (denoting variability), “probably” (suggesting guesswork), and elaborated talk. The conversation can be structured to elicit more accurate reporting.

Slot filling is also restricted to cases where users are unlikely to need to go outside of a predefined set of values. “Traditional slot filling methods with classification models in the task-oriented dialogue system cannot predict unseen slot values in a pre-defined value list” (ref).

In slot-filling use cases, it is often good practice to present the full set of slot values back to the user for confirmation.

### Complex logic

In some cases, the conversational need is more complex than a set of slots that need to be filled. For example, symptom checkers have become a popular way of automating the triage process for health symptoms. These automated triage services first map a user’s symptom statement to an algorithm, which then elicits information about the user’s state of health, and gradually navigates to outcomes (e.g. whether to see a doctor, if so how urgent it is, what specialty that doctor should have, connecting to follow-up services, etc…). The questions to be asked, and the information to be collected, are guided by a clinical logic behind the scenes, much like how a doctor would assess a patient's symptoms. In a use case like this, the information cannot all be collected in one turn, nor can it be neatly summarized as a set of slots. Instead, many turns are working together to fulfill an external logic.

The symptom checker is a piece of technology that converts the logic of clinical triage into a conversational information collection service. Other clinical logics can similarly be conversationalized, including chronic condition monitoring programs for conditions like diabetes or congestive heart failure (CHF). In these cases, the logic is more complex than simply filling a list of pre-existing slots. Instead, the “slots” that need filling depend on prior answers, according to the relevant features of the health situation. You don’t just fill slots like blood pressure and weight, since what values are important depend on other factors.

### Slot-filling + complex logic

You can also combine slot-filling approaches with these broader logics. Perhaps you have narrowed a patient to a heart failure program and know that you need blood pressure and weight information. At that point, there are two slots that need filling, the user’s blood pressure and weight, and a slot-filling structure could support the elicitation. On the other hand, a more directed dialogue could collect this information, asking for each piece one at a time.
