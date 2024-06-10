# Using in OpenDialog

{% hint style="info" %}
As you learn about how to implement different patterns in OpenDialog please keep in mind that OpenDialog is a flexible model that can support a variety of different implementations. We urge conversation designers to use the indications below as a means to learn, be inspired or be unblocked but not as the canon of how things should be done in OpenDialog!
{% endhint %}

In OpenDialog, there are two primary places you are likely to put a supporting pattern like authentication. If the entire scenario requires authentication, then it belongs in the welcome conversation. In this case, the scope of authentication is the entire experience.&#x20;

The figure below provides an example of how such a scenario-wide authentication could be handled. Within the Welcome Conversation we have two scenes - one which welcomes the user if they are already authenticated and one which leads them to an Accounting Linking conversation (or an Info conversation for help) if they need to authenticate.

<figure><img src="../../../../../.gitbook/assets/image (444).png" alt=""><figcaption></figcaption></figure>

If, however, authentication is required only for a specific conversation within the overall scenario, then the authentication could live as a scene within that conversation. This approach is the just-in-time approach to authentication.&#x20;

If some subset of conversations require authentication, but not the entire scenario, then a more complicated solution is required. The design decision for where to put the authentication pattern depends on what parts of the scenario require authentication.
