---
title: Contexts and attributes
---

Contexts are information stores that the ConversationEngine and ResponseEngine use to read and write attributes. Each context has its own persistence rules — some survive across sessions, others exist only for a single request or a specific processing step.

Attribute references use the format `{context_name.attribute_name}`. When no context prefix is given, OpenDialog defaults to the `user` context.

For a full breakdown of all available contexts, their scope, and usage examples, see [Contexts](/core-concepts/contexts-and-attributes/contexts).

For information on attribute types, naming, and how to create and manage attributes, see [About attributes](/core-concepts/contexts-and-attributes/about-attributes).
