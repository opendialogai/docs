# OpenDialog Conversation Engine

Creating an architecture for your assistant is flexible in the OpenDialog platform.&#x20;

In order to build robust applications, and to be able to troubleshoot your design, it is critical to understand how the conversation engine decides where to look for a next action.&#x20;

## Starting and open behavior

Starting components, for instance a turn that is a starting turn, are only considered when you join a level for the first time. After the first interaction, they are no longer considered.&#x20;

Open turns are considered only after the starting turn is over. They are always considered from that time on.&#x20;

Components can be both open and starting. &#x20;

Because of these rules, it is very important for a designer to consider the behavior for any component.

<img src="../.gitbook/assets/2023-03-08_16-29-24 1.png" alt="Screen showing the edit turn area of the component pane." data-size="original">&#x20;

## Conversation engine at the start of an interaction

At the start of an interaction, the conversation engine&#x20;

* Explores all starting conversations, all the starting scenes within these conversations, all the starting turns within those scenes and any request intents associated with those starting turns will be considered as possible starting intents
* Considers the incoming utterance and attempts to match it to one of the possible starting intents
* If the match is successful the conversation state is updated to that intent and we are now in a fully defined conversation state down to the level of an intent.

## How a user intent is selected

When there are multiple available user intents in your conversation design, the conversation engine needs to decide which one to select.

First, the conversation engine will run the interpreter associated with each available user intent in the conversation design. The interpreter will take the user's input and will attempt to match an intent with it. If the _interpreted_ intent name matches the _expected_ intent name in the conversation design, then we will continue with the intent. If the interpretation does not match, or provides no interpreted intents, then we will discard the expected intent from consideration.

<figure><img src="../.gitbook/assets/Screenshot 2024-08-23 at 15.30.55.png" alt="A screenshot of the OpenDialog Designer. It shows two user intents, one called Update Policy and another called Add Driver."><figcaption><p>There are two available user intents in this conversational position.</p></figcaption></figure>

Using the example from the screenshot above, if the user were to be in this conversational position and says "add my partner to my policy", then the conversation engine will run two interpreters: one for `UpdatePolicy` and one for `AddDriver`. If our interpreters are working well, it would match the user's input to the `AddDriver` intent. This would mean that the conversation engine will discard the `UpdatePolicy` intent. As there are no additional conditions on the `AddDriver` intent, it will be selected by the conversation engine.

If both interpreters were to return intents that match, then the conversation engine will select the intent that appears first. In the example from the screenshot above, this would mean the `UpdatePolicy` intent would be selected if both intents were matched by their interpreters.

### Intent prioritisation for Semantic Intent Classifiers

As [Semantic Intent Classifiers](../opendialog-platform/interpreters-and-natural-language-understanding/language-services/semantic-intent-classifier/) allow you to define intents and sub-intents, it is more likely that interpreters using your classifier will match more than one intent. To ensure that you do not need to carefully order intents in the Designer, Semantic Intent Classifiers return their intents with a priority ranking. Sub-intents are ranked the highest priority, as they are more specific and granular. Whereas intents are ranked as a lower priority, as they are general and broad.

<figure><img src="../.gitbook/assets/Screenshot 2024-08-23 at 15.40.04.png" alt="A screenshot of the OpenDialog Designer. It shows two user intents, one called Manage Policy and another called Update Milage."><figcaption><p>There are two available user intents in this conversational position.</p></figcaption></figure>

Using the example from the screenshot above, let's presume that both intents are connected to a Semantic Intent Classifier in which `ManagePolicy` is an intent and `UpdateMilage` is a sub-intent of this intent. Under regular circumstances, if both intents were to match, then `ManagePolicy` would be selected as it appears first. However for Semantic Intent Classifiers, when both intents match, the sub-intent will be selected. Therefore in this example, an input of "update my milage" will match both intents, but will `UpdateMilage` be selected by the conversation engine as it has a higher priority as a sub-intent.

## During an interaction, these prioritization rules apply

1. If the matching user intent defines a transition, the engine will follow that transition.&#x20;

<figure><img src="../.gitbook/assets/2023-06-20_16-05-02.png" alt=""><figcaption></figcaption></figure>

2. If there is no transition, look for a matching app response intent within the turn.&#x20;

<figure><img src="../.gitbook/assets/2023-06-20_15-55-55.png" alt=""><figcaption></figcaption></figure>

3. If there is no transition and no response intent is present in the turn, the engine will look for a next intent in another turn within the same scene.

<figure><img src="../.gitbook/assets/2023-06-20_15-59-11.png" alt=""><figcaption></figcaption></figure>



<figure><img src="../.gitbook/assets/2023-06-20_15-59-35.png" alt="" width="375"><figcaption></figcaption></figure>

4. If an intent has the completing behavior: after this intent is executed we go back up to the scenario level.&#x20;
5. If none of the rules in this section apply, then a no match is triggered, either local or global (scenario level).



