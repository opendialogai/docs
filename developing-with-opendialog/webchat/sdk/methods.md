---
description: This section describes the methods available on the WebChat SDK
---

# Methods

The WebChat SDK provides the following methods that allow you to interact with your chat widget programmatically:&#x20;

* `.init()`&#x20;
* `.destroy()`&#x20;
* `.refresh()`&#x20;
* `.restart()`&#x20;
* `.open()`&#x20;
* `.close()`&#x20;
* `.sendMessage()`&#x20;

***

## Initialise

Initialise an instance of WebChat using your preferred settings and - optionally - a set of custom components and an existing user ID:

```typescript
/**
* Initialise the chat widget with settings and custom components
* @function init
* @param {Object} [settings={}] - settings object (optional)
* @param {Array} [customComponents=[]] - array of custom components (optional)
* @param {?string} [userId] - uuid for the user (optional)
*/

.init(settings, customComponents, userId)
```

If you do not provide a settings object, WebChat will look for one on the `window.openDialogSettings` object. If that's not present either, initialisation will fail. At a bare minimum, the settings object MUST include the following:

```typescript
const settings = {
  url: 'your_bot_url', // The base URL for API requests. Tells WebChat where to get your conversation data from
  appKey: 'your_app_key', // Authenticates your requests
  sdkEnabled: true, // Enables the SDK. Otherwise an iframe widget will load on page load
  user: {
    custom: {
      selected_scenario: your_scenario_id // The specific sceanrio you want to load in your bot
    }
  }
}
```

***

## Destroy

Destroy an existing WebChat widget:

```typescript
/**
* Destroy the chat widget
* @function destroy
*/

.destroy()
```

***

## Refresh

Refresh your WebChat widget with new settings. Does not change the conversation in any way. Calling `refresh()` will make a new call out to the `/chatApi-config` endpoint to ensure that any other interface settings affected by your changes are also updated. Your new settings will then be applied over those received from the server.

```typescript
/**
* Refresh the chat widget with new settings
* @function refresh
* @param {Object} [settings={}] - settings object. Will be merged with existing settings
*/

.refresh(settings)
```

***

## Restart&#x20;

Restart your WebChat widget with new settings, a new starting intent, and/or a new user.  Restart is distinct from Refresh because it affects the current conversational state.&#x20;

The first parameter - `clearUser: Boolean` - determines whether to refresh the conversation from the beginning with the same user, or whether to clear all user data and start again from the very beginning. In both instances, the message list will be cleared ready for a new conversation to begin (note that this does not clear the user history, so if you retain the current user and they refresh the page then, depending on your settings, they may see the previous conversational history rendered)

If you provide an `openIntent: string` parameter, you can tell WebChat where to restart the conversation from. This success relies a little on your conversation design as this intent needs to be available at the point of request.

The parameter `userId: 'string'` is only applicable where `clearUser === true` and will allow you to restart the conversation with a given user.

```typescript
/**
* Restart the chat widget
* @function restart
* @param {boolean} [clearUser=false] - clear the user (optional)
* @param {Object} [settings={}] - settings object. Will be merged with existing settings (optional)
* @param {?string} [userId] - uuid for the user. Only applicable where clearUser is true (optional)
* @param {?string} [openIntent] - openIntent for the chat widget (optional)
*/

.restart(true, settings, userId, openIntent)
```

***

## Open

Opens the WebChat widget. The current open state of the widget is exposed on the instance and can be interrogated by calling `webchat.openState`

```typescript
/**
* Open the chat widget
* @function open
*/

.open()
```

***

## Close

Closes the WebChat widget. The current open state of the widget is exposed on the instance and can be interrogated by calling `webchat.openState`

```typescript
/**
* Close the chat widget
* @function close
*/

.close()
```

***

## Send Message

Send a message to chatApi through the WebChat widget. Note that the success of this functionality is very much dependent on your conversation design. The correct intent needs to be available to the conversation engine at the point of requesting!

```typescript
export interface IPostMessage {
  text: string
  type?: string
  callback?: string
  value?: string
  escalating?: boolean,
  data?: any
}

/**
* Send a message through the chat widget
* @function sendMessage
* @param {IPostMessage} msg - message object.
*/

.sendMessage(msg)
```
