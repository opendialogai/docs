---
title: Restart
description: This pattern allows the user to restart the interaction.
---

This functionality is not activated by default; it must be activated in the Interface Settings page

![](~/assets/2023-11-09-18-52-09.png)

*Toggle for Restart button in settings*

![](~/assets/2023-11-09-18-53-48.png)

*Restart icon in user interface*

If the user clicks the **Restart** button at any point during the conversation, an `intent.core.restart` intent is generated. Similar to a no match, the conversation engine will look for an intent.core.TurnRestart intent in a turn in the current scene. If no intent is found, the engine will look for an intent.core.SceneRestart intent in the conversation, and if no intent is found, the engine will look for an intent.core.ConversationRestart.

If none of these are found, the global intent.core.restart is executed. This intent is provided by default in the Trigger conversation (see screenshot)

![](~/assets/2023-11-09-18-48-53.png)

*intent.core.restart in the Trigger conversation*

By default the intent.core.restart in the custom template transitions to the Welcome Turn. However, you may want to customize the the prompt to handle the restart versus a welcome for a new interaction. You can do this in a number of ways. One way is to create a separate restart turn in addition to the welcome turn and transition to that turn.

### Contextual Restarts

Individual turns, scenes and conversations can handle restarts however they need.

Consider a scene in which we are trying to gather information about a user. Our conversational flow will be a question from the app, followed by an answer from the user. Now imagine the user made a mistake in the information they entered and hit the restart button.

This is what a scene for this might look like:<br>

![A scene to gather user information](~/assets/image-282.png)

The turn named `Scene Restart` can have the NLU to capture the user utterance indicating they made a mistake, and transitioning them back to the top of this scene.

In this case, if the user restarts the flow at any point in this scene, we would want to route them back to the `Get Name Turn`(that is the first turn in this scene). To do so the scene restart intent transitions to the Get Name turn.

![The Scene Level Restart](~/assets/image-248.png)

:::tip
Notice the intent is named `intent.core.SceneRestart` as we want to capture all restarts within this scene
:::

Now, if the user clicks the restart button at any point in within this scene, they will be routed straight back to the start of the scene.
