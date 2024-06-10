# Amazon Lex interpreter

The OpenDialog Lex integration allows us to use Amazon Lex for intent interpretation and entity extraction.

### Requirements

To use Amazon Lex, you'll need an [Amazon Web Services](https://aws.amazon.com/) account. Please see [these steps](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/) for instructions on signing into AWS. Once you've signed into AWS, you'll need to create some resources in order to connect your account to an OpenDialog Lex interpreter.

### Create the Lex interpreter

First you'll need to create the Lex interpreter in OpenDialog. On the "Interpreters Setup" page, select "Add new interpreter". Here you'll need to choose a unique name for the interpreter and select the Lex type.

![Interpreter screen](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.19.03.png>)

You'll see that you need to enter some settings in order to configure the interpreter. The following sections will details how to collect this information.

### Create an IAM user

#### User

In order to expose access to a Lex bot, you'll need to create a user account via AWS' Identity and Access Management (IAM). IAM enables you to manage access to AWS services and resources securely.

In the AWS admin panel, search for "IAM" and select the returned result. You are now in the IAM dashboard panel. From the left hand menu, under the "Access management" heading, select "Users". From here select the blue "Add users" button.

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.22.33.png>)

From here you will need to configure the new user. Choose a user name of your choice (perhaps "OpenDialogLexUser"), and select the credential type as "Access key - Programmatic access". Then select the blue "Next: Permissions" button.

Select "Create group" under the "Add user to group" heading. Choose a group name of your choice (perhaps "OpenDialogLexGroup"), and then search for and select the "AmazonLexReadOnly" and "AmazonLexRunBotsOnly" policies. Now that the group is configured, click the blue "Create group" button. After the modal has closed, click "Next: Tags".

For this configuration we don't need to add any tags, so this section can be skipped. Select "Next: Review" to continue.

On this final screen you can review the user configuration. When you're ready, click "Create user" to finish.

#### Access key and secret

Now that you've created your IAM user for Lex, select the new user from the "Users" table. On this screen, under the "Summary" heading there are multiple tabs. Select the tab titled "Security credentials". In this tab, under the "Access keys" heading, we can manage access keys for our IAM user. This is where we will create and find the first two pieces of data that OpenDialog requires: the key and the secret.

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.24.03.png>)

Click "Create access key". A modal will appear which contains a table with your key ID and secret key. The value under "Access key ID" should be pasted into the "Key" field in OpenDialog, and the "Secret access key" should be pasted into the "Secret" field.

Now that you have the IAM user details, you can create the Lex bot.

### Create a Lex bot

#### Bot

In the AWS admin panel, search for "Lex" and select the returned result. You are now in the Lex dashboard panel. OpenDialog's Lex integration only works with bots created via the Lex V2 console, so if you will need to switch to the V2 console if prompted. Select "Create bot" to get started.

You will need to provide some basic details before your bot can be created. Under "Bot configuration", choose a bot name of your choice. Under "IAM permissions" select "Create a role with basic Amazon Lex permissions" (this is separate from the IAM user we created above). All other settings on this screen are at your discretion. Click the orange "Next" button when you're done.

On this screen you can configure the language of the bot. Use the "Select language" dropdown to select your desired language and locale. Click the orange "Done" button to create the bot.

#### Intent

Once your bot is created, you'll be automatically redirected to a screen for editing an intent. From OpenDialog to validate that the integration has been configured correctly, you'll need to set up at least one intent. To do this, you can re-purpose the intent you're currently viewing. If you'd like to come back to this later, all you'll need to do is add a single sample utterance. Under "Sample utterances", enter a sample utterance (such as "hello lex") and click "Add utterance".

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.28.03.png>)

For further details on setting up intents, see the [Lex documentation](https://docs.aws.amazon.com/lexv2/latest/dg/build-intents.html). Once you've set up the intent, click "Save Intent" and then "Build". The build process may take a few minutes, you'll know it's complete when you see a green "Successfully built..." message at the top of the screen.

#### Bot credentials

Now that we've built our bot, we need to gather the final four pieces of data that OpenDialog requires: the region, Bot ID, Bot Alias ID and Locale ID.

The region is an identifier for which area of the world your Lex bot is served from. This identifier can be found in the URL of the Lex page, after `https://` and before `.console.aws.amazon.com`. Your region identifier will be something similar to `sa-east-1`, `eu-west-1`, `ap-south-1` , etc. Copy this value and paste it into the Region field in OpenDialog.

To find the Bot ID, select the third item in the horizontal menu at the top of the screen. This item should read "Bot: {your bot name}". This will take you to the settings page for the bot you've created. Under "Bot details", copy the value next to the "ID:" label and paste it into the Bot ID field in OpenDialog.

To find the Bot Alias ID, select "Aliases" from the left hand menu. This will show you a listing of all the aliases for your bot. Select the alias that you created earlier. Under "Details", copy the value next to the "ID:" label and paste it into the Bot Alias ID field in OpenDialog.

Finally we need the Locale ID. The locale ID represents the language and locale pairing that you chose when creating your Lex bot. See Amazon documentation for [a full list of region identifiers](https://docs.aws.amazon.com/lexv2/latest/dg/how-languages.html). Select the relevant locale code that matches what you chose when creating the bot. This code will be something similar to `en_IN`, `fr_FR`, `ja_JP`, etc. This locale code is the Locale ID, paste it into the Locale ID field in OpenDialog.

You've now collected all the details required for the Lex interpreter.

### Test the interpreter

Now that the interpreter is configured to integrate with our Lex bot, it can be tested via the "Check Interpreter Setup" in the bottom right. Enter an utterance such as "hello lex" (or whatever sample utterance(s) you entered for the intent earlier) and you should see that it was interpreted as the expected intent. It's useful to note the confidence percentage here, as this will be used shortly.

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.32.48.png>)

If the test returns an error, please review the Lex settings that you used to configure the interpreter.

### Publishing your interpreter

You will need to publish your interpreter before you can use it in your Scenario. To do this you need go to the interpreter landing page (`<instance-name>.cloud.opendialog.ai/admin/interpreters`) and then activate the interpreter by turning the slider green.

### Use the interpreter for an intent

Now that you've configured and tested your Lex interpreter you'll want to make use of it for intent matching.

The following steps presume that that you are working with the default conversations provided when you create a new scenario, if this is not the case some steps may vary depending on your scenario's design.

In your scenario, locate the "Welcome Turn" within the "Welcome Conversation". By default this turn includes a single application request intent, and a single user response intent which matches the user clicking the default "OK" button. Add a second user response intent here to match the `newIntent` intent that was trained in Lex.

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.38.44.png>)

It's important to note that the confidence level for the intent should be less than what was returned in our test. If Lex interprets an intent with a confidence lower than our threshold, OpenDialog will disregard it.

After you've set up the intent, make sure to save it.

### Preview & Lex specific attributes

Now that the interpreter is set on the intent, everything is in place see the Lex interpreter working in "Preview".

After the webchat widget loads, if you send a message such as "hello lex" (or whatever sample utterance(s) you entered for the intent earlier), you should see that the welcome message is re-sent to you. This means that OpenDialog successfully interpreted and matched the new Lex intent (if it didn't you'll get a no match error message).

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.42.01.png>)

To the right, under "Context" and "User" you should see some new attributes that begin with "lex\_". These attributes provide you with data about any slot elicitation or intent confirmation that might be configured in Lex. In OpenDialog, an intent is modeled as a single user utterance, and any slot filling is performed by subsequent intents. Therefore if you'd like to make use of Lex's slot elicitation or intent confirmation, you will need to query these Lex attributes via [OpenDialog conditions](https://docs.opendialog.ai/developing-with-opendialog/conditions).

![](<../../../../.gitbook/assets/Screenshot 2021-11-01 at 09.42.38 (1).png>)

Well done, you've now got your Lex bot integrated with your conversational application.
