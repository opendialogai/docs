---
description: >-
  This section describes the WebChat SDK and the functionality you can access as
  a developer using WebChat within your own application.
---

# SDK

## Getting started with the WebChat SDK

The WebChat SDK can be used in any website or browser-based application and requires a basic understanding of Javascript to set up and use. These docs assume you are familiar with Javascript and, ideally, a little Typescript.&#x20;

### Adding WebChat SDK to your website

To add the SDK code to your site, insert the following code into your application:

{% code title="index.html" %}
```html
<!-- In the <head> section of your page: -->
<link rel="stylesheet" href="https://assets.webchat.opendialog.app/style.css">

<!-- Within the body of your page, include a container to load WebChat into -->
<div id="od-webchat"></div>

<!-- Before the closing <body> tag of your page: -->
<script src="https://assets.webchat.opendialog.app/opendialog-webchat.umd.mjs"></script>
```
{% endcode %}

### Initialise your WebChat widget

```typescript
// Provide some settings for your WebChat widget. 
// You can find the basic settings required in the Publish section of the OpenDialog platform
const settings = {
    url: 'your_bot_url',
    appKey: 'your_app_key',
    sdkEnabled: true, // Make sure to include this one!
    language: 'en',
    user: {
      custom: {
        selected_scenario: your_scenario_id
      }
    },
    customSettings: {
      openCta: {
        title: 'Hello!👋 Click me!',
        borderRadius: '50px',
        width: '280px',
        height: '80px',
        background: '#001abf'
      }
    }
  }
  
  // Instantiate your WebChat widget, passing in the element you want to load it into
  const webchat = new ODWebChat.OpenDialogChatSDK('#od-webchat')

  // Initialise your WebChat widget, passing in your settings
  webchat.init(settings)
```

You can find more info about the settings required to launch a WebChat instance [here](../../../opendialog-platform/launching-your-application.md)
