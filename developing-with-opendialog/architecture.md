---
description: A high-level description of the OpenDialog Architecture
---

# Architecture

## OpenDialog Architecture

OpenDialog is a [Laravel](https://laravel.com) application with a MySQL backend for user management and content management and a [Dgraph](https://dgraph.io) backend \(a graph-based database written in Go\) for conversation management and conversational analytics. 

{% hint style="info" %}
For information on how to setup OpenDialog locally or on a server [have a look here](../getting-started-1/installing-opendialog/). 
{% endhint %}

Below is a brief description of the main components of OpenDialog. 

### **Conversation Description Language**

The Conversation Description Language \(CDL\) is a YAML-based format that allows us to specify conversational applications entirely in code. It also captures the specification for the types of functionality that the Conversation Engine should be able to support. 

In earlier versions of OpenDialog you had to write conversations directly in the CDL. From version 1.x onwards, however, you create the conversations through the no-code Conversation Designer. 

We provide the [CDL specification](../reference/conversation-description-language.md) for those that are interested in the detailed low-level view and for those that would be looking to get involved with core OpenDialog development. 

{% hint style="info" %}
Roadmap: we will be supporting import and export of conversational applications in this YAML format. Currently we only support an intermediate JSON format which is useful for transferring applications from one instance to the other but is not as readable.
{% endhint %}

### OpenDialog Core and OpenDialog Application

Each of the components described below \(except the Conversation Description Language\) is a _module_ of [OpenDialog Core](https://github.com/opendialogai/core). OpenDialog Core orchestrates functionality between the different modules and it is pulled into the [OpenDialog Application](https://github.com/opendialogai/opendialog). The OpenDialog application is your starting point for building conversational apps. The OpenDialog Application provides the no-code user interface through which to compose conversational applications. You can then extend it based on your specific needs.

### **Conversation Engine** 

The [conversation engine](https://github.com/opendialogai/core/tree/1.x/src/ConversationEngine) "runs" our conversations. It's the heart of OpenDialog. It determines, based on incoming utterances and overall state, what the next actions and outgoing messages should be. It also updates context appropriately. 

### Attribute Engine

The [attribute engine](https://github.com/opendialogai/core/tree/1.x/src/AttributeEngine) manages attributes. Attributes hold relevant information for our conversations and all components rely on attributes to exchange and share information. 

### **Context Engine** 

The [context engine](https://github.com/opendialogai/core/tree/1.x/src/ContextEngine) keeps track of state by providing stores for attributes. Through attributes we can store and retrieve information that is relevant to determining what actions and what messages we should perform.

### **Sensor Engine**

The [sensor engine](https://github.com/opendialogai/core/tree/1.x/src/SensorEngine) receives incoming messages and maps them to OpenDialog standard utterances and attributes and prepares them for consumption by the Conversation Engine. It is designed in a way that we can deal with multiple platforms \(webchat, Slack, Alexa, etc\).

### **Response Engine**

The [response engine](https://github.com/opendialogai/core/tree/1.x/src/ResponseEngine) takes an _outgoing intent_ \(in OpenDialog terminology this represents something the application wants to say\) and maps it to an actual message. The final message may change based on the channel it will be sent to and overall context.

### Action Engine

The [action engine](https://github.com/opendialogai/core/tree/1.x/src/ActionEngine) performs actions defined within conversations. It interfaces with the conversation engine and the context engine to update context and allow conversations to proceed taking into account the results of actions. Actions are the main way our conversational applications interfaces with external systems.

### **Webchat Widget**

The [Webchat Widge](https://github.com/opendialogai/webchat)t is a widget you can add to any website or web application and interact with an OpenDialog-powered chatbot. It provides a number of different message types and has a simple API to interact with as well as a rich set of configuration options.

#### The OD Lifecycle

_This is a simplified view of the activities that take place from user input to bot response to give you a sense of how OpenDialog works._

![OpenDialog Architecture](../.gitbook/assets/opendialogarchitecture.png)

It all starts with an incoming message at one of the OpenDialog sensors.

**Receive message**

Each sensor deals with a specific conversational interface platform and converts that message to an OpenDialog Utterance. Sensors listen at a specific endpoint \(for webchat that is `incoming\webchat`\) and deal with any platform specific authentication/authorisation/validation issues.

**Convert to Utterance**

The SensorEngine then converts that message to an Utterance that OpenDialog can understand. An Utterance represents what the user said \(or did - i.e. an event\) and also carries relevant contextual information about the platform that originated that utterance. The Utterance is passed to the OpenDialog Controller that orchestrates overall activity from this point onwards.

**Determine what to reply**

The OpenDialog Controller will pass the utterance on the ConversationEngine that will determine:

* the intent of the Utterance and whether there are any attributes contained within the utterance that we should store. To determine intent, the ConversationEngine sends the intent to an IntentInterpreter. 
* what a suitable outgoing intent would be based on the overall state of the conversation. 
* perform any actions associated with the incoming intent or \(once it is determined\) with the outgoing intent. 
* persist any contexts to be ready for the next interaction with the user

**Determine how to reply**

Once we have identified with what outgoing intent we should reply we match that intent to an actual message that is able to achieve the required intent. The ResponseEngine does the work of matching the outgoing intent to an actual message.

