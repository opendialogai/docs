# FAQ

**How does OpenDialog store data?**

Data is stored in the UK and EU. OpenDialog only stores customer data and conversational history for a maximum of 90 days within the platform. This length of time is configurable and can be amended as needed on a client by client basis. We also make this data available via an API for clients to pull into their own databases away from OpenDialog, and it can be set  up to immediately remove the data from OpenDialog's database once it's been transferred to your database. As an additional note on this, we do not transfer or move the data outside of the UK/EU.

**Is OpenDialog GDPR Compliant?**&#x20;

We follow all GDPR best practices. As stated in the contract, OpenDialog is the processor and our client is the controller of the data collected.

**How does deleting and removing data from OpenDialog happen?**\
Any responsibilities around managing and triaging removal requests, sits with the client - which would then be sent to OpenDialog, when required, following the process here - [https://opendialog.ai/privacy-policy/](https://opendialog.ai/privacy-policy/).&#x20;

**How does OpenDialog anonymize data?**\
The data stored by default is not anonymized unless there is a specific request to configure this. As you're setting up all of the journeys within the application, we do not know the data that you're collecting in them, so can not anonymize data if we do not know what's there. It needs custom scripts setting up and running to remove specific pieces of information.&#x20;

See the question regarding data store length and process for removal which will help towards this point by removing all data from being stored in OpenDialog completely.&#x20;

**Does the message editor support variants of messages?**

The message editor supports the ability to provide different versions of a message. These versions are managed through conditions. For instance, you can customize a message for a new user versus an existing user by using the condition that checks e.g. the value of an attribute called "new\_user" on the default user context to be true or false. \
You can also use the "seconds since last seen" attribute to vary the wording of your message. This is particularly helpful for any situation where the same intent will be repeated in quick succession, such as an FAQ, help or noMatch.&#x20;

**How can I add users to a workspace?**

Users can be added to a workspace by adding "/users" after the "/admin/" portion of the URL. For example: yourworkspacename.cloud.opendialog.ai/admin/users. Enter the user's name and email. No password is set. Let the user know the URL and ask them to set their password using the "Forgot password" link.&#x20;

**Can teams collaborate on a scenario?**

Team members can be added to a workspace (see entry above). A log of comments, changes and versioning can be added at the scenario level in the description field. This is shown on the scenario overview page. Add the most recent comments at the top and they will display on the scenario overview page. At the utterance level, comments can be added to the sample utterance field. In text-based chatbots, comments in the sample utterance field can be added to both app and user intent. With Alexa skills, this is only possible for app intent since this field in the user intents is used to list actual sample utterances.&#x20;

&#x20;
