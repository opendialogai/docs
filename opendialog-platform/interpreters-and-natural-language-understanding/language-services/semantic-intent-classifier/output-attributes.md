# Output attributes

When using Semantic Intent Classifiers you may get other output attributes alongside any [custom output attributes](./#custom-output-attributes) you have defined. Please see the following sections for descriptions and examples of how you might use each of these attributes.

## Default output attributes

### interpretation.flagged\_moderation

This attribute denotes that the prompt was flagged. This could be due to additional prompt instructions or the user's utterance. It will be set to `true` if the prompt was flagged, otherwise it will not be set.

### interpretation.flagged\_moderation\_categories

If you are using Azure or Gemini, and the prompt has been flagged, then this attribute denotes the flagged categories. `interpretation.flagged_moderation_categories` is a string collection attribute than will contain zero or many categories. The list of possible moderation categories varies between providers.

You could use this attribute in conditions in your conversation design. For example if you had a Semantic Intent Classifier to interpret a user utterance but it failed due to prompt moderation, you could use the `interpretation.flagged_moderation_categories` attribute to [condition](../../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) failure messages to let the user know what moderation category was flagged. These conditions would use the In Set operation, such as "interpretation.flagged\_moderation\_categories In Set violence" to condition a message to only display if the Semantic Intent Classifier failed due the violence category being flagged.
