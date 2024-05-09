# Authentication

User authentication may be needed when protected information is transmitted. Some example use cases requiring authentication include initiating a transaction, checking balances, looking at information about employees, or reviewing company analytics. When looking at public information, users may not need to authenticate.

Whether or not a user needs to go through the authentication process themselves depends on whether the system can do it for them or not. If the system already knows who the user is, the bot could authenticate behind the scenes for a frictionless interaction. If, for example, the bot is integrated into a mobile app that already knows the user’s info, then that info could be used to authenticate, and the user would never need to know. The user then gets an authenticated experience without having to re-authenticate.

{% hint style="info" %}
If user authentication is needed, it is good to do it “just in time”. A user may start by asking general questions (FAQs), in which case there is no need to hassle them with authentication. But at the moment they try to do something requiring authentication (e.g. check their account balance), then the authentication pattern should be triggered. Basically, don’t waste a user’s time authenticating unless or until it’s necessary.
{% endhint %}
