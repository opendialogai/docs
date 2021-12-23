---
description: Scenarios in OpenDialog
---

# Scenarios

{% hint style="info" %}
Have you read our '[Getting started with OpenDialog](getting-started-1/getting-started-with-opendialog/)' section? If not, we would advise reading that before you dive into the content here as it gives an overview of the concepts behind OpenDialog.
{% endhint %}

At the center of the whole OpenDialog experience is the Conversation Designer. This is where you can start designing new scenarios and manage existing scenarios.&#x20;

![The Designer](<.gitbook/assets/image (77).png>)

## Active and Draft Scenarios&#x20;

Scenarios can be in either an "Active" or in "Draft" mode.&#x20;

Active scenarios are available to be used in chat interfaces, while draft scenarios are not considered.&#x20;

{% hint style="info" %}
**Roadmap:** We will be adding a host of additional support around scenario states to handle mode nuanced situations such as versioning of scenarios, previewing scenarios, etc.&#x20;
{% endhint %}

## Scenario Settings

![Scenario Settings](<.gitbook/assets/image (74).png>)

Scenario settings are accessible through the individual menus of each scenario. You can edit the Scenario name, description, set a preferred interpreter (which will act as the default interpreter throughout the scenario) and also set conditions.

When you create a scenario a condition is automatically set (e.g. `user.selected_scenario...`) that checks the user context to see if they have a selected scenario defined. If a condition is not present then the scenario will always be considered.&#x20;

{% hint style="warning" %}
If you delete this condition you will have to provide a different way to select the scenario - something you should do with care unless you put in place other conditions for scenario selection
{% endhint %}

## Deleting Scenarios

Deleting a scenario will currently completely remove the scenario and all its elements (including all underlying conversations, scenes, turns, intents and messages).

{% hint style="info" %}
Roadmap: We are working on functionality such as archiving and undoing delete actions but for the time being deletion is permanent!
{% endhint %}

## Copying Scenarios

You can replicate a scenario by clicking on the copy icon within the designer.

## Exporting and Importing Scenarios

Currently exporting scenarios is only possible through the command-line interface. So will require assistance from the OpenDialog team. Please reach out to support@opendialoig.ai and we can help with replicating scenarios.

{% hint style="info" %}
Roadmap: The ability to export and import scenarios is on our roadmap.
{% endhint %}

