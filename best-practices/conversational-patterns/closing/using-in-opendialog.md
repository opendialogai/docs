# Using in OpenDialog

{% hint style="info" %}
As you learn about how to implement different patterns in OpenDialog, please keep in mind that OpenDialog is a flexible model that can support a variety of different implementations. We urge conversation designers to use the indications below as a means to learn, be inspired or be unblocked but not as the canon of how things should be done in OpenDialog!
{% endhint %}

The topic closing check and last topic check are a good fit for OpenDialog, closing different levels of the interaction hierarchy. This can be realized in OpenDialog as a closing of the scene and then a closing of the conversation. Other times, there may only be a last topic check (there is no scene-level topic closing check). Once the closing is complete, the user may be offered the opportunity to restart.
