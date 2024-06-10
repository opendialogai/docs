# Launching your application

## Publishing a single scenario to WebChat

To launch your conversational application using the OpenDialog WebChat on your website or application, start by activating the scenario. To do so, go to the 'Scenarios' page and click on the slider to set it to 'active'.

![Active and draft scenarios](<../.gitbook/assets/image (428).png>)

Next, go to Interface Settings under the Publish menu and click "Get embed code". Copy the embed code. &#x20;

<figure><img src="../.gitbook/assets/2023-05-02_09-13-40.png" alt=""><figcaption><p>Interface settings screen with open embed code window</p></figcaption></figure>

Add the embed code to the bottom of the `body` section on the website or application page(s) where the WebChat should appear. &#x20;

## Alternating scenarios in a single WebChat embed using aliases

### The basics

OpenDialog Aliases allow you to create a single point of reference for your WebChat application.  This functionality will enable you to define an 'alias' and map the scenario of your choice at any given time.&#x20;

### Aliases in action

* **Add WebChat once, and publish any scenario**.  The alias functionality allows you to have a single WebChat embed code to which you can deploy different scenarios at the moment of your choice without changing the underlying structure or code.
* **Update your live application on the go**, by switching scenarios easily. You can now update your live application by mapping an alias to a different scenario with just one click.
* **Use different scenarios at different moments for A/B testing, without structural changes.**  Using an alias and mapping different scenarios to the alias, allows you to A/B test one scenario over another through your live application.

### Where to find

An alias can map to any given scenario and therefore exists on the Workspace level.  You can access the Aliases functionality from the Workspace Dashboard by expanding the 'Scenarios' drop down menu, where you can then find 'Aliases' in the Menu.

<figure><img src="../.gitbook/assets/Screenshot 2023-05-26 at 14.16.37.png" alt="Screenshot of Alias homepage"><figcaption><p>Access the Alias functionality via the Workspace Menu</p></figcaption></figure>

### How it works

{% embed url="https://youtu.be/k57nEd_ruWQ" %}
How to use Aliases in the OpenDialog Product
{% endembed %}

#### Creating an alias

To create an Alias you need an Alias name and a scenario.&#x20;

The Alias name must follow certain rules: only lowercase letters can be used, and spaces must be replaced with underscores (\_). No numbers, symbols, or uppercase letters are allowed.

<figure><img src="../.gitbook/assets/Screenshot 2023-05-26 111039.png" alt=""><figcaption><p>The Alias creation UI</p></figcaption></figure>

An alias is mapped to an existing scenario.

Once the Alias is created, an embedded WebChat code is created and provided.

#### Updating an alias

Once an Alias is created it appears in the Alias tab of the workspace. To edit, click into the Alias, change the linked scenario, and click the "Update Alias" button.

<figure><img src="../.gitbook/assets/Screenshot 2023-05-26 110829.png" alt="Screenshot with UI to update an alias"><figcaption><p>The Alias updating UI</p></figcaption></figure>

The only part of an Alias that can be changed is the scenario it links to. The name cannot be changed, and the embedded webchat code will not be changed when the scenario is changed.

