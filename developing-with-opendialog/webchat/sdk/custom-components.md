---
description: >-
  This section describes how you can pass in your own message types to be
  rendered in the WebChat application.
---

# Custom Components

WebChat will allow you to pass in your own components to render as message types in the message list. This means that you could, for example, write your own Location message using a maps plugin of your choice and use it to override the default OpenDialog Location message, which requires a Google Maps API key.&#x20;

Or you could use custom components to render message types outside of the current types supplied by OpenDialog. However, you will also need to set up a backend data source that provides the correct message data for WebChat to render in your components.

For more info about the current message types, response types and their data structure, explore our [ChatAPI documentation](../webchat-api.md).

## How to create & use your custom components

Any component passed into the WebChat application must be written as a `Vue 3` single file component. How you create and import your components into your application beyond that is entirely up to you.&#x20;

Every message-type component that you create can receive the following properties, and emit the following events:

{% code fullWidth="false" %}
```typescript
<your-message-component
   :msg="" // Message object - the current message object. See the API docs for more details
   :theme="" // Theme object - taken from the theme/colours that you passed into your settings or set in the interface settings section of OpenDialog
   :latest="" // boolean - derived dynamically from the current message history. Indicates whether the message is the latest one in the list
   :errorTemplates="" // object - uses settings.messages from the config endpoint
   :language="" // string - the currently selected language code
   @submit="(data: any) => onComponentSubmit(data.type, data.data)"
   @cancel="onCancel(message)"
/>
```
{% endcode %}

### A working example

This is an example of a very basic message component that renders some text and emits a `submit` event when the button is clicked:

{% code title="LocationMessage.vue" %}
```html
<template>
  <div class="location-message">
    <p>{{ msg.data.text }}</p>
    <small>I'm a basic component being used to override the default location message</small>
    <button class="submit" @click="handleSubmit">Submit</button>
  </div>
</template>

<script setup lang="ts">
export interface ILocationMessage {
  author: string
  data: {
    text: string
    callback_id: string
    attribute_name: string
    api_key: string
    [key: string]: any
  }
  [key: string]: any
}

export interface ILocationProps {
  msg: ILocationMessage
  theme?: {[key: string]: any}
  latest?: boolean
  errorTemplates?: {[key: string]: any}
  language?: string
}

const props = withDefaults(defineProps<ILocationProps>(), {
  msg: () => {
    return {} as ILocationMessage
  }
})

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  const data = {
    text: 'You clicked the submit button!',
    callback: props.msg.data.callback_id,
  }
  
  /**
  * @event submit
  * @type {object}
  * @property {object} data - The data you wish to send back to ChatApi
  * @property {string} type - The response type you wish to send. See API docs for more details
  */
  emit('submit', {data, type: 'button'})
}
</script>

<style scoped>
.location-message {
  color: green;
}
</style>
```
{% endcode %}

Now that we have a component, we need to provide WebChat with a name for it and some optional other values. At it's simplest, this will look as follows:

{% code title="main.js" %}
```typescript
import { LocationMessage } from 'my-library' // this will depend on your setup
import type { Component } from 'vue' // you don't need Vue as a dependency at this point. This is just importing the Component type for our interface

interface CustomComponent {
  name: string
  component: Component
  fullScreen?: Boolean
  autoShow?: Boolean // only applicable if overriding the esign or location message
  showMessage?: Boolean // only applicable if overriding the fp-form message
}

const componentData: Array<CustomComponent> = [
  {
    name: 'location', // must be the same as the `type` in the message data.
    component: LocationMessage,
    fullScreen: true,
    autoShow: false
  }
]
```
{% endcode %}

The `name` property must be the same as the message `type` property in the data. This is how WebChat maps message components to the data received from the API.

Finally, we can pass in our custom components when we initialise our WebChat widget:

{% code title="main.js" %}
```typescript
const webchat = new ODWebChat.OpenDialogChatSDK('#my-webchat-element')

webchat.init(settings, componentData)
```
{% endcode %}

When we put all these elements together, your Javascript code will look like the following:

{% code title="main.js" %}
```typescript
import { LocationMessage } from 'my-library'
import type { Component } from 'vue'

interface CustomComponent {
  name: string
  component: Component
  fullScreen?: Boolean
  autoShow?: Boolean 
  showMessage?: Boolean 
}

const componentData: Array<CustomComponent> = [
  {
    name: 'location',
    component: LocationMessage,
    fullScreen: true,
    autoShow: false
  }
]

const settings = {
  url: 'your_bot_url', 
  appKey: 'your_app_key', 
  sdkEnabled: true,
  user: {
    custom: {
      selected_scenario: your_scenario_id 
    }
  }
}

const webchat = new ODWebChat.OpenDialogChatSDK('#my-webchat-element')

webchat.init(settings, componentData)
```
{% endcode %}

At this point, when WebChat receives a message from ChatApi with a `type` of `location` , it will render the custom component rather than the default one provided by OpenDialog.
