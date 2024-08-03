# Load Webchat within page Element

By default, the webchat iFrame widget will be added to the bottom of the page `<body>`after all page content. A CSS file is added to the page the widget is loaded on to position and size the iFrame that contains the chatbot.

In order to override this and have the iFrame drawn in a specific place on the page, you will need to update the chatbot embed code to include a `parentEl` item. eg:

```
<script>
  window.openDialogSettings = {
    url: 'https://brian-may.cloud.opendialog.ai',
    user: {
      custom: {
        selected_scenario: '0x420'
      }
    },
    parentEl: "#chatbot"
  };
</script>
```

The `parentEl` needs to be a valid CSS selector for the page - the above will place the iFrame inside the element with ID `chatbot`

NB - even if the chatbot is loaded inside an element, the default CSS is still applied to give the iFrame a fixed position.

Update your page CSS to have control over where the iFrame is positioned on the page and its size:

```
#chatbot>iframe#opendialog-chatwindow {
  position: static;
}
```

The page loaded within the iFrame adds a fixed width and auto margins. To be able to set a height You should overwrite these in a custom CSS sheet and have that loaded via the interface settings:

```
.od-chat-window.iframe {
  margin: 0;
  width: 100%
}

.od-chat-window.iframe.opened {
  margin: 0;
}
```
