# Electronic Institutions

In OpenDialog conversational applications are modelled as _electronic institutions_ \(EIs\).

> An EI is "an organisational structure for coordinating the activities of multiple interacting agents".

It mimics the concept of a conventional institution, as a space for coordinating the activities of individuals and transposes and evolves those concepts to fit the needs of a digital setting.

The abstraction of an EI, and the semantics it offers, provides the conceptual framework for capturing the activities of interacting agents in a conversational setting and describe them in a consistent and coherent way.

Almost anything we do in day to day life is a type of social institution. The way we behave in a restaurant \(walk in, get seated, orders taken, etc\), the way we behave in a shop, the way we behave at the office and so on. All these institutions define some norms and regulations about how everyone within an institution is supposed to behave so that the purpose the istitution was designed or has evolved for is achieved. For example, if you walk in a restaurant and start throwing things around or swearing at other guests you will be asked to leave. It is not acceptable behaviour. If you walk into a restaurant and ask for something of the menu before you were seated at a table you might be asked to wait to be seated, that is the norm of how the

> In OpenDialog _every_ participant, from bots to human users, is modelled as an agent participating in an EI. We use the same concepts and abstractions for both throughout giving us a _coherent_ model of the system through a common set of concepts.

Before we go on to the specifics of EIs and how we use them, there are four core characteristics that are worth highlighting as they underpin the overall design and approach of EIs.

#### An EI models social activities

The agents in our EI need to cooperate and coordinate to achieve their goals. The bot needs to ask the right questions and the user needs to provide relevant information in order to further the overall goals. In designing the system we need to cater for how to make both the bot \(or bots\) and the human \(or humans\) aware of what role they are playing in a given situation and what the expectations are of their role in that situation in order to further the overall goals.

#### An EI caters for decomposable activities

Activities are decomposable. A larger goal \(e.g. order a pizza to be delivered to a specific location\) can be decomposed into smaller activities \(choose restaurant from which to order, define order, define location, deliver, pay, rate experience, etc\). These smaller activities each require an exchange of _utterances_ in different stages with each stage achieving a specific goal. We call the different stages _scenes_. _Scenes_ can be composed into larger _conversations_.

_Conversations_ have a specific purpose and a well defined communication protocol. Networks of scenes represent the progress of a conversation through different phases with potentially different constraints and relevant context. As the conversation progress through scenes different _activities_ are also completed, each taking us closer to the final goal.

#### An EI is an open system

Openess from an EI perspective means that agents can enter or leave the system at any point. The design of conversations and the management of knowledge needs to cater for constant and unpredictable change. Crucially for dialogical systems with humans involved, handling the unexpected gracefully is key.

#### An EI is a dialogical system

Activities within an EI are achieved through the exchange of utterances and the performance of activities. Activities can change or reveal states of the world the EI is in, either as a direct result of an utterance \(e.g. the utterance "cook a pizza" will lead to the activity of cooking a pizza\) or because an activity is required to be able to provide a reply to an utterance \(e.g. the utterance "are all doors closed?" may lead to the activity of collecting information from all doors about their state\).

