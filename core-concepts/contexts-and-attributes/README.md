# Contexts and Attributes

Contexts and attributes are at the heart of how OpenDialog stores and retrieves information during a conversation.

**Attributes** are named pieces of information — things like a user's name, a collected form value, or the output of an LLM action. **Contexts** are the stores that hold them, each with different persistence and access rules.

To reference an attribute in a message or condition, you use the format `{context_name.attribute_name}` — for example, `{user.first_name}` or `{session.lookup_result}`.

For full details, see:

{% content-ref url="contexts.md" %}
[contexts.md](contexts.md)
{% endcontent-ref %}

{% content-ref url="about-attributes.md" %}
[about-attributes.md](about-attributes.md)
{% endcontent-ref %}