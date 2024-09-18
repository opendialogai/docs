---
description: This section describes the events available on WebChat via the SDK
---

# Events

WebChat emits a number of events that you can listen to within your own application.&#x20;

## Adding an event listener

To add an event listener, use:&#x20;

```typescript
webchat.on('event_name':string, callback: Function)
```

Each listener will return a `CustomEvent` object with specific data nested in the `event.detail` object:

```typescript
/**
* Add an event listener to the chat widget
* @function on
* @param {string} eventName - the event to listen for
* @param {Function} callback - the function to call when the event is triggered
* @returns {CustomEvent} - the event object with specific data in the event.detail object
*/

.on('loaded', (e: CustomEvent) => {
    console.log(e.detail) // the event data specific to WebChat
})
```

For convenience, all events return the element upon which the event was fired within the `detail` object. For additional return values, see the descriptions below.

### Supported events

`'loaded'` - fired when the WebChat widget has initialised.&#x20;

Returns a 'loaded' property with a Boolean value:&#x20;

`loaded: true`

***

`'openStateChanged'`  - fired when the WebChat widget is opened or closed.

Returns a String value:&#x20;

```typescript
enum openState {
  OPEN = 'open',
  CLOSED = 'closed'
}

return openState: openState.OPEN
```

***

`'messageSent'` - fired when the user sends a message.

Returns a message object:

```typescript
export interface IMessagePayload {
  kind?: 'outgoing'
  author: string
  content: IMessageContent
  message_id: string
  notification: string
  user_id: string
  uuid?: string
  mode?: string
  modeInstance?: number
  partOfLastTemplate?: boolean
}

export interface IMessageContent {
  author: string
  callback_id?: string
  id: string
  mode?: string
  modeInstance?: number
  type: string
  user: Object
  data: {
    text: string
    date: string
    time: string
    value?: string
    [key: string]: any
  }
  escalating?: boolean
}

return message: IMessagePayload
```

***

`'messageReceived'` - fired when WebChat receives a message from the server.

Returns a message object:

```typescript
export interface IMessage {
  kind?: 'incoming'
  first?: boolean
  last?: boolean
  author: string
  intent?: string
  type: string
  data: IMessageData
  uuid?: string
  authorAvatar?: string
  authorName?: string
  partOfLastTemplate?: boolean
}

export interface IMessageData {
  text: string | null
  meta?: {
    author?: {
      name?: string
      avatar?: string
      [key: string]: any
    }
    [key: string]: any
  }
  attribute_name: string | null
  date: string | null
  disable_text?: boolean
  hideavatar?: boolean
  hidetime?: boolean
  internal?: boolean
  time: string | null
  elements?: IElement[] | IElementsObject
  submit_text?: string
  [key: string]: any
}

return message: IMessage
```

***

`'chatEnded'`  - fired when the user selects 'end chat' from the menu in the WebChat application
