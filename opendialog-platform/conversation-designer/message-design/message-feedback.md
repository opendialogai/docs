---
+description: Let end users rate bot messages with thumbs up/down in webchat.
+---
+
+# Message feedback
+
+Message feedback lets end users rate bot messages in webchat with a simple **thumbs up** or **thumbs down**. This helps you understand which messages are helpful and where users are struggling, so you can iterate on your message content and conversation flow.
+
+## Enable message feedback
+
+Message feedback is controlled in two places:
+
+1. **Interface Settings (global default)**\n   In [Webchat Interface Settings](../webchat-interface-design/webchat-interface-settings.md), enable **Message feedback** to turn it on by default for your webchat experience.
+2. **Message Editor (per-message override)**\n   In the [Message editor](message-editor.md), set **Message feedback** to one of:\n   - **Inherit**: use the interface setting (default)\n   - **Enable**: show thumbs for this message\n   - **Disable**: never show thumbs for this message
+
+## How it appears in webchat
+
+When message feedback is enabled, webchat can show thumbs for eligible bot messages. After a user submits feedback, webchat will typically disable the controls to prevent re-submission.
+
+## Custom messages (XML)
+
+If you are using custom message XML, you can control feedback using the `enable_feedback` attribute:
+
+- `enable_feedback="true"`: enable feedback for this message
+- `enable_feedback="false"`: disable feedback for this message
+- Omit the attribute: inherit the interface setting
+
+## Related pages
+
+- [Message editor](message-editor.md)\n- [Webchat Interface Settings](../webchat-interface-design/webchat-interface-settings.md)\n- [Chat API](../../../developing-with-opendialog/webchat/webchat-api.md)
