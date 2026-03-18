---
description: Let end users rate bot messages with thumbs up/down in webchat.
---

# Message feedback

Message feedback lets end users rate bot messages in webchat with a simple **thumbs up** or **thumbs down**. This helps you understand which messages are helpful and where users are struggling, so you can iterate on your message content and conversation flow.

## Enable message feedback

Message feedback is controlled in two places:

1. **Interface Settings (global default)**  
   In [Webchat Interface Settings](../webchat-interface-design/webchat-interface-settings.md), enable **Message feedback** to turn it on by default for your webchat experience.
2. **Message Editor (per-message override)**  
   In the [Message editor](message-editor.md), set **Message feedback** to one of:
   - **Inherit**: use the interface setting (default)
   - **Enable**: show thumbs for this message
   - **Disable**: never show thumbs for this message

<!-- SCREENSHOT: Message feedback setting (tri-state)
     Location: Message editor > Behaviours (or equivalent section)
     Purpose: Show where to configure inherit/enable/disable -->

<figure><img src="../../../.gitbook/assets/PLACEHOLDER-message-feedback-message-editor.png" alt="Message feedback setting in the Message editor"><figcaption><p>Message feedback setting in the Message editor (inherit / enable / disable).</p></figcaption></figure>

## How it appears in webchat

When message feedback is enabled, webchat can show thumbs for eligible bot messages. After a user submits feedback, webchat will typically disable the controls to prevent re-submission.

<!-- SCREENSHOT: Message feedback widget in webchat
     Location: Webchat conversation view (bot message)
     Purpose: Show how the thumbs up/down widget looks to end users -->

<figure><img src="../../../.gitbook/assets/PLACEHOLDER-message-feedback-webchat-widget.png" alt="Message feedback widget in webchat"><figcaption><p>Message feedback widget (thumbs up/down) shown under an eligible bot message in webchat.</p></figcaption></figure>

## Related pages

- [Message editor](message-editor.md)
- [Webchat Interface Settings](../webchat-interface-design/webchat-interface-settings.md)
- [Chat API](../../../developing-with-opendialog/webchat/webchat-api.md)
