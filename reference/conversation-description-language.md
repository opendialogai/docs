---
description: The OpenDialog CDL
---

# Conversation Description Language

{% hint style="info" %}
This is provided as a reference for those interested in understanding in detail the approach that OpenDialog takes. We use this reference to define the behaviour of the conversation engine and support import and export of conversational applications within OpenDialog. 

This reference is work in progress.
{% endhint %}

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://tools.ietf.org/html/bcp14) [RFC2119](https://tools.ietf.org/html/rfc2119) [RFC8174](https://tools.ietf.org/html/rfc8174) when, and only when, they appear in all capitals, as shown here.

This document is licensed under [The Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The OpenDialog Conversation Description Language specification defines a standard, implementation agnostic, way of describing conversations between participants in a conversational application and the semantics through which that conversation would be interpreted or _executed_ through a conversational engine. 

The OpenDialog CDL can be used to capture conversational patterns and then provided to an appropriate conversation engine for execution. 

## Definitions  

### CDL Document

A CDL document is a document that describes an aspect of a conversational application using the CDL. It conforms to the [1.2 Yaml spec](https://yaml.org/spec/1.2/spec.html).  

### Component

A component is a part of a CDL specification that performs a specific function and has a specific meaning. Examples of components are actions, interpreters, operations and contexts.

#### Scenario

A scenario is a collection of conversations around a specific goal. In terms of the underlying OpenDialog concepts a scenario is an [Electronic Institution](https://docs.opendialog.ai/concepts/electronic-institutions). A scenario, through conversations, defines the expected set of interactions between participants in the scenario, as well as rules that govern the overall behavior of the scenario or individual participants. 

#### Conversation

A conversation captures a specific high-level activity as part of a scenario. For example in a Restaurant Scenario you may have a _Collect Order_ conversation __or a _Settle Bill_ conversation. 

#### Scene

A scene is a subset of interactions within a scenario that are semantically, contextually and operationally related. For example in the _Collect Order_ conversation you may have a _Collect Starter Orders_ scene before you move on to the _Collect Main Dishes_ scene. 

#### Turn

A turn is a specific exchange between participants in the scene. Typically, it involves the user requesting something and then the application responding. That single request-response exchange represents a turn and a scene is made of multiple turns. The CDL provides means to define different behaviours for turns that enable us to compose them into sophisticated scenes without having to define static flows through exchanges. 

#### Attribute

An attribute is a describable feature of the environment. The set of all attributes used within a conversational application provide a light-weight domain ontology for that conversation application. We use attributes to describe both features of the conversational application itself \(e.g. _current conversation, user_ etc\) and of the application domain \(_price, color_, etc\). 

#### Action

An action changes the environment within which a conversational application operates by manipulating attributes of that environment. In practical terms that means communicating with internal or external APIs to affect changes in services that interface with the conversational application.

#### Interpreters

An interpreter transforms an input from a participant of a conversation, typically the user, to a specific intent that the conversation engine can reason about.  

#### Operation

An operation accepts a set of environment attributes, performs a calculation and returns true of false based on some success criteria for that operation. Operations are used in conditions.

#### Context 

Contexts are the mechanisms through which we store and access information relevant to a Scenario. Information is stored in the form of attributes. Context typically have a specific scope - either across an entire scenario, around a user, a conversation, or a scene. Conversational applications can define their own domain-specific contexts.

#### Behavior

A behaviour can be associated with a Scenario, Conversation, Scene and Turn and represents a _directive_ to the conversational engine that provides additional context around how that specific components should be treated. 

## Specification

### Scenario

A **scenario** is defined as a set of related conversations and the associated OD components that are required to execute those conversations. A scenario is described through a **scenario document.** 

Here is an example scenario document:

{% code title="example\_scenario.yaml" %}
```yaml
od_cdl_version: 1.0
type: scenario
name: Example Scenario
id: example_scenario
description: This is a long text describing the scenario that will be used in the UI.
behavior:
 - placeholder
default_interpreter: interpreter.core.nlp 
conditions:
  - condition:
      operation: gte
      parameters:
        - id: value_a
          value: _intent.price
        - id: value_b
          value: 10conversations:
  - id : conversation1
    ref: conversation1/conversation.yaml
  - id : conversation2
    ref: conversation2/some_conversation.yaml
  - id : conversation3
    ref: conversation3/theother_conversaiton.yaml
```
{% endcode %}



| Field Name | Type | Description |
| :--- | :--- | :--- |
| `od_cdl_version` | string | This **REQUIRED** string **MUST** be the semantic version number of the OD CDL specification that the scenario document adheres to.  |
| `type` | string | **REQUIRED** - the type of document that is defined below |
| `name` | string | **MAY** - a scenario document may have a user-friendly name. |
| `description` | string | **MAY** - a scenario document may have a description of that scenario |
| `behavior` | collection of strings | **MAY** - a scenario may have a collection of behavior directives that direct the conversation engine to treat the scenario in a given way |
| `id` | string | **REQUIRED** - a scenario is required to have an id. The same OD system cannot support two scenarios with the sane id. IDs can contain alphanumeric characters `[a-zA-Z09]` and underscores `_` only.  |
| `conversations` | yaml collection | **MAY** - a conversation collection block may exist. \(n.b. a scenario without any conversations is not very useful but can exist from a spec perspective\) |
| `default_interpreter` | string | A scenario **MAY** define a defaultInterpeter that will be used for any intent that does not have an interpreter defined itself \(or any of the components that lead to that intent\) |
| `conditions` | collection of conditions \(see Condition\) | A scenario **MAY** define conditions that need to hold true for that scenario to be considered.  |
| Conversation Collection Item | Yaml Collection Item  | A Conversation collection item **MUST** have an `id` representing the conversation, it **MAY** have a reference `ref` to a conversation document implementing that conversation. The reference is a path relative to the root from the scenario document.  |

### Conversation

A **conversation** is a self-contained set of exchanges of **intents**, between **participants** in the conversation grouped in **scenes** and then **turns**. 

Here is an example conversation document:

```yaml
od_cdl_version: 1.0
type: conversation
name: Example Conversation
id: example_conversation
description: This is a long text describing the conversation that will be used in the UI.
behaviors:
 - starting
 - open
 - placeholder
default_interpreter: interpreter.core.nlp 
conditions:
 - condition:
      operation: gte
      parameters:
        - id: value_a
          value: _intent.price
        - id: value_b
          value: 10
scenes:
  - scene: 
      name: Example Scene
      description: A long description for the scene
      id: example_scene
      behaviors:
        - open
        - starting
      turns:
        - turn:
          id: turn_id
          name: Turn Name
          behaviors:
           - open
           - starting
           - single
          intents:
            - request: 
              - user:
                  id: intent.core.welcome
            - response:      
               - app:
                  id: intent.core.onboard    
              
            
```



| Field Name | Type | Description |
| :--- | :--- | :--- |
| `od_cdl_version` | string | **REQUIRED** - this string must be the semantic version number of the OD CDL specification that the conversation document adheres to.  |
| `type` | string | **REQUIRED** - the type of document that is defined below |
| `name` | string | **MAY** - a conversation document may have a user-friendly name. |
| `description` | string | **MAY** - a conversation document may have a description of that conversation |
| `id` | string | **REQUIRED** - a conversation is required to have an id. The same OD scenario cannot support two conversations with the sane id. IDs can contain alphanumeric characters `[a-zA-Z09]` and underscores `_` only.  |
| `behaviors` | collection of strings | **MAY** - a conversation may have a collection of behavior directives that direct the conversation engine to treat the conversation in a specific way. An starting behavior indicates that this is a valid conversation to start a scenario with while an open behavior indicates that the conversation is open to be selected if the user is already in that scenario. Starting conversations may or may not be open conversations.  |
| `default_interpreter` | string | A scenario **MAY** define a default\_interpeter that will be used for any intent that does not have an interpreter defined itself \(or any of the components that lead to that intent\)  |
| `conditions` | collection of conditions \(see Condition\) | A conversation **MAY** define conditions that need to hold true for that conversation to be considered.  |
| `scenes` | colelction of scenes \(see Scene\) | A conversation **MAY** define a set of scenes  |

#### Conversation Behaviors

`starting` A starting behavior indicates that this is a valid conversation to start the scenario with if the user was not already actively interacting with the conversational application through the scenario. 

### Scene

A scene captures the expected exchange of intents between participants in a scene. A scene is part of a conversation document. 

```yaml
scenes:
  - scene: 
      name: Example Scene
      description: A long description for the scene
      id: example_scene
      conditions:
        - condition:
            operation: gte
            parameters:
              - id: value_a
                value: _intent.price
              - id: value_b
                value: 10
      behaviors:
        - open
        - starting
      default_interpreter: interpreter.core.nlp  
      turns:
        - turn:
          id: turn_id
          name: Turn Name
          behaviors:
           - open
           - starting
           - single
          intents:
            - user:
              id: intent.core.welcome
            - app:
              id: intent.core.onboard    
 
```



| Field Name | Type | Description |
| :--- | :--- | :--- |
| `scenes` | string | Scenes **MUST** be defined within a `scenes` collection |
| `name` | string | **MAY** - a scene may have a user-friendly name. |
| `description` | string | **MAY** - a scene may have a description of that scene |
| `id` | string | **REQUIRED** - a scene is required to have an id. The same OD scenario cannot support two conversations with the sane id. IDs can contain alphanumeric characters `[a-zA-Z09]` and underscores `_` only.  |
| `conditions` | collection of conditions \(see Condition\) | A scene **MAY** define conditions that need to hold true for that scene to be considered.  |
| `behaviors` | collection of strings | A scene **MAY** define a set of behaviours that will be taken into consideration when evaluating the scene in a conversational context |
| `default_interpreter` | string | A scene **MAY** define a default\_interpeter that will be used for any intent that does not have an interpreter defined itself \(or any of the components that lead to that intent\)  |
| `turns` | collection of Turns \(see Turn\) | A scene **MUST** describe at least one conversational turn.  |

#### Scene Behaviors

`starting` A starting behavior indicates that this is a valid scene to start the conversation with if the user was not already actively in an ongoing conversation that the scene is part of. 

`open` An open scene indicates a scene that should always be considered within a conversation if the current scene the user is in does not have an appropriate matching intent.  

### Turn

A turn is a specific exchange of intents between participants in a scene.

```yaml
        - turn:
          id: turn_id
          name: Turn Name
          behaviors:
           - open
           - starting
           - repeat:
             - param: order
               value: 2
          default_interpreter: intent.core.nlp     
          valid_origins:
           - turn-id
           - turn-id 
          intents:
            - request:
              - user:
                  id: intent.core.welcome1
              - user:
                  id: intent.core.welcome2               
            - response:    
              - app:
                  id: intent.core.onboard1    
              - app:
                  id: intent.core.onboard2    

```



| Field Name | Type | Description |
| :--- | :--- | :--- |
| `turns` | string | Turns **MUST** be defined within a `turns` collection |
| `name` | string | **MAY** - a turn may have a user-friendly name. |
| `id` | string | **REQUIRED** - a turn is required to have an id. The same scene cannot support two turns with the sane id. IDs can contain alphanumeric characters `[a-zA-Z09]` and underscores `_` only.  |
| `conditions` | collection of conditions \(see Condition\) | A turn **MAY** define conditions that need to hold true for that turn to be considered.  |
| `behaviors` | collection of strings | A turn **MAY** define a set of behaviours that will be taken into consideration when evaluating the scene in a conversational context. A behavior **MAY** have associated parameters. |
| `default_interpreter` | string | A turn **MAY** define an interpreter that will be used unless the intents within the turn define an interpreter. |
| `valid_origins` | collection of turn ids | A turn **MAY** define a set of turn ids that are valid origins for this turn. The turn that defines a valid origin is the _destination_ turn and a turn that is defined as a valid origin is the _originating_ turn. A turn that defines valid origins will only be considered if the conversational state is currently in one of the indicated origin turns.  |
| `intents` | collection of Intents \(see Intent\) | A turn **MUST** describe at least one intent from one participant. |

### Intent

An intent is a specific exchange that a participant in a conversation says. 

```yaml
          intents:
            - user:
                id: intent.core.welcome
                interpreter: interpreter.core.Luis
                expected_attributes:
                  - item.price
                      if-not-present-transition:
                        conversation: some_conversation
                        scene: another_scene
                        turn: turn_id
                  - item.color
                behaviors:
                  - completing
                transition:
                 conversation: some_conversation
                 scene: another_scene
                 turn: turn_id
                listens:
                 - intent.core.somethingElse
                 - intent.core.new 
                virtual:
                  - user:
                    id: intent.core.Virtual 
                actions:
                  - action:
                    id: action.core.CalculateDiscount
                    attribute_input:
                      - id: item.price
                    attribute_output:
                      - id: item.discounted_price  
                conditions:
                  - condition:
                      operation: gte
                      parameters:
                        - id: value_a
                          value: _intent.price
                        - id: value_b
                          value: 10
            - app:
                id: intent.core.onboard    
```

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `intents` | string | Intents **MUST** be defined within an `intents` collection |
| `user | app` | string | An intent **MUST** be said by either the user or the app.  |
| `id` | string | An intent **MUST** have an intent id |
| `interpreter` | string | An intent **MAY** have an interpreter id - if an interpreter is defined we use that interpreter to interpret utterances in cases where that utterance is expected to match to the intent in question.  |
| `completes` | boolean | An intent **MAY** indicate that it completes a conversation. In this case the conversation is considered completed and following this intent no additional intents are exchanged. If this was an intent from the user it means that we will not respond to the user. If this was an intent from the bot it means that once we respond to the user we will consider the existing conversation completed.  |
| `transition` | Collection | An intent may cause a transition that will move the conversational state to a new conversation or scene or turn. A transition **MUST** define at least one of the three and there are different logics applied to how we handle the transition based on what is available.   |
| `actions` | collection of Actions \(see Actions\) | An intent **MAY** define a series of actions that are performed if the intent in question is selected as the next intent in the scene.  |
| `conditions` | collection of conditions \(see Condition\) | An intent **MAY** define conditions that need to hold true for that intent to be considered.  |

### Transition

A transition is a directive to move the conversational state to a specific new conversation, scene or turn. Transitions are triggered at the intent level. For a transition to succesfully move the state there are two requirements:

1. The new state \(turn, scene or conversation\) has an opening intent that matches the originating intent.
2. The new state \(turn, scene or conversation\) starts with the next speaker \(e.g. when a user causes a transition that moves us to a turn where the app is the first participant\) and the participant explicitly states that it is listening for an _out of scene_ intent that matches the originating intent. 

#### Turn Transition

A turn transition takes place when the CDL only defines a turn. The conversation engine should look for other turns within the same scene that meet one of the two requirements above. 

#### Scene Transition

A scene transition means that we will look for open turns in the new scene that match the requirements

#### Scene Transition with Turn

A scene transition with turn means that we will move to the new scene and only evaluate the specified turn against the requirements

#### Conversation Transition

A conversation transtition means that we will evaluate all scenes within the new conversation for the requirement.

#### Conversation Transition with Scene

A conversation transition with scene that we will only evaluate a specific scene within the new conversation

#### Conversation Transition with Scene and Turn 

A conversation transition with scene and turn means that we will evaluate only the specific turn within the new conversations and scene. 

### Condition

A condition is an operation to be performed that can only return TRUE or FALSE. We can optionally supply parameters that will be taken into consideration when performing the operation. 

These parameters have an id \(a label that provides an indication of what they are\) and can either be raw values or dynamic values extracted from attributes stored in contexts. 

The values associated with attributes are typically reference comparison points. For example, below the operation will evaluate the total order price is greater than or equal to the price value. 

Conditions are always presented within a `conditions` block. All conditions must evaluate to true for the condition block to pass. 

```yaml
 conditions:
    - condition:
      operation: gte
      parameters:
        - id: value_a
          value: _intent.price
        - id: value_b
          value: 10
```

In the condition example above we have a `gte` operation \(greater than or equal\) that accepts two parameters. `value_a`is compare to `value_b` to determine whether it is greater than or equal to it. `value_a` is the `price` attribute stored in the `_intent` context and `value_b`  is the reference value we want to compare to, which is 10. 

### Action

An action is an operation that may accept a set of attributes as inputs, performs an action \(typically interaction with outside APIs\) and may return a set of attributes as outputs. 

```yaml
                  - action:
                    id: action.core.CalculateDiscount
                    attribute_input:
                      - id: item.price
                    attribute_output:
                      - id: item.discounted_price  
```



