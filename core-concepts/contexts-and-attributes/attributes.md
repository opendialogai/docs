# Composite Attributes

Attributes can be _scalar_ (store just one value), or they can be _composite._ Composite attributes store multiple attributes within them.&#x20;

To create a composite attribute, one must create a Webhook Action (and webhook).&#x20;

The only default composite attributes are the user and utterance attributes in the user context, however these are not actively promoted to the user. It is possible to query these attributes to get data related to the user or utterance (like the utterance text / callback ID).&#x20;

The advantages of using a composite attribute: it is a way of grouping related data together and gives the possibility of acting on the group as a whole (i.e. rather than single attribute for each element of quote data, we can simply replace the whole quote attribute if the quote is refreshed).&#x20;

Composite attributes are introduced by engineering (backend work) and may then be used by conversation designers. &#x20;
