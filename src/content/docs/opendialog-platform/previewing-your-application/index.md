---
title: Previewing your application
---

Within OpenDialog you can preview any Webchat application so you can test and validate the conversational experience before deploying your application.

![](</.gitbook/assets/Preview Sidebar.jpg>)

*Default conversation design view*

In the sidebar, hover on Test and click on Preview to interact with the preview application.

### Functionality

![](</.gitbook/assets/Preview Main (1).jpg>)

*Preview screen*

The chatbot preview options include:

**1** - **Refresh Scenario**: this refreshes the scenario, including resetting context and removing custom attributes

**2** - **Webchat options** (download chat transcript, restart, end chat etc. based on your settings)

**3** - **Minimize preview**

The preview console panel includes:

**4** - The **path of the incoming intent**. The links are clickable and will take you through to the intent so that you can make any changes as required.

**5** - **The path of the outgoing intent**. The links are clickable and will take you through to the intent so that you can make any changes as required.

6 - **The paths that were considered by the conversation engine**

When clicking in the Considered Path, a larger version of the considered path is displayed, and an option to view the selected path (circles with green border), the non-selected paths (circles with red border) and an explanation for both selected and rejected paths.

![](</.gitbook/assets/Preview Considered Path.jpg>)

*Considered Path*

![](</.gitbook/assets/Preview Selected Path.jpg>)

*Selected Path*

**7 - Simulating Custom Attributes**

* **Custom Simulation:** Use the **Set Attribute** feature to simulate custom attributes, which is useful for testing conditions on messages, components, or intents.
* **Accessing the Popup:** Click **"Set Attribute"** to open the Custom Attributes Popup.
* **Viewing & Filtering:** Navigate to the **8 - Attributes** tab to view, search, and filter the context.

As an example, imagine we want to show different messages to users depending on whether they are a new user or a returning user.

In the message editor, we need to set conditions on the messages to indicate which message should show depending on the value of the attribute saved against the user. To distinguish a new user of the bot from a returning user, we set the 'Attribute' to `seconds_since_last_seen` and the 'Value' to be less than '`0`' for new users or to be greater than '`0`' for returning users.

To test this within the preview, for a returning user, we would type in `seconds_since_last_seen` to the 'Attribute' field and then '`1`' into the value field then click on 'Set attribute value'. The updated value is shown in the User Context section of the Attributes tab. 

**8- Filtering Attributes**

* **Search & Filter:** Easily search for attributes or their values within the context.
* **Attribute Details:** Hover over any attribute to view detailed information.

![](</.gitbook/assets/Preview Attribute.jpg>)

Note: in general no further action needs to be taken to set the custom attribute. Specifically for `seconds_since_last_seen` we need to refresh the whole page. Do not click Refresh Scenario as this resets the entire context, including the value we just defined.
