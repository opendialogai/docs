---
description: Scenarios in OpenDialog
---

# Scenarios

The centre of the OpenDialog experience is the Designer. This is where you can start designing new scenarios and manage existing scenarios. 

![The Designer](.gitbook/assets/image%20%2877%29.png)

## Active and Draft Scenarios 

Scenarios can be in either an "Active" or in "Draft" mode. 

Active scenarios are available to be used in chat interfaces, while draft scenarios are not considered. 

{% hint style="info" %}
**Roadmap:** We will be adding a host of additional support around scenario states to handle mode nuanced situations such as versioning of scenarios, previewing scenarios, etc. 
{% endhint %}

## Scenario Settings

![Scenario Settings](.gitbook/assets/image%20%2874%29.png)

Scenario settings are accessible through the individual menus of each scenario. You can edit the Scenario name, description, set a preferred interpreter \(which will act as the default interpreter throughout the scenario\) and also set conditions.

When you create a scenario a condition is automatically set \(e.g. `user.selected_scenario...`\) that checks the user context to see if they have a selected scenario defined. If a condition is not present then the scenario will always be considered. 

{% hint style="warning" %}
If you delete this condition you will have to provide a different way to select the scenario - something you should do with care unless you put in place other conditions for scenario selection
{% endhint %}

## Deleting Scenarios

Deleting a scenario will currently completely remove the scenario and all its elements \(including all underlying conversations, scenes, turns, intents and messages\).

{% hint style="info" %}
Roadmap: We are working on functionality such as archiving and undoing delete actions but for the time being deletion is permanent!
{% endhint %}

## Copying Scenarios

{% hint style="info" %}
Roadmap: The ability to copy scenarios is on our roadmap
{% endhint %}

### Exporting and Importing Scenarios

Currently exporting scenarios is only possible through the command-line interface. 

{% hint style="info" %}
Roadmap: The ability to export and import scenarios is on our roadmap.
{% endhint %}



