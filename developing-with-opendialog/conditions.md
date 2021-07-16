---
description: Introduction to Conditions in OpenDialog
---

# Conditions

Conditions can be used to ensure that only specific elements are considered for matching. They can be specified in the following places:

* **Scenario Level** - if conditions are not met then the entire Scenario is not considered
* **Conversation Level**  - if conditions are not met then the entire Conversation is not considered
* **Scene Level** - if conditions are not met then the entire Scene is not considered
* **Turn Level** - if conditions are not met then the entire Turn is not considered
* **Intent \(APP & USER\)** 
* **Messages** 

If multiple conditions are given for a single element they are combined on an `AND` basis, in other words they must **all** be true for the element to be considered.

### Conditions on Intents

Conditions can used on both APP and USER intents, however their behaviours differ slightly.

Conditions on USER intents are evaluated after interpretation, which means that OpenDialog will have interpreted the user's utterance _\(but not yet have matched to an incoming intent\)_. The conditions of these potential intents are then evaluated, with the first passing intent being selected. This allows conversation designers to specify conditions using attributes of the interpreted intents. This can be done by using the built-in `_intent` context which will be temporarily populated with the expected attributes of the intent.

For APP intents, conditions are evaluated first. Conditions are, currently, the only way to instruct OpenDialog to choose between a consecutive grouping of outgoing intents within the same turn.

