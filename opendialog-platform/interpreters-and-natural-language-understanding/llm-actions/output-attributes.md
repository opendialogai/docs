# Output attributes

When using LLM actions you may get many output attributes alongside any [custom output attributes](./#use-custom-output-attributes) you have defined. Please see the following sections for descriptions and examples of how you might use each of these attributes.

## Default output attributes

### action\_success

This attribute is output by all types of actions (not just LLM actions). It is a boolean attribute that denotes whether the action succeeded or failed. A LLM action might fail for a few reasons:

* The credentials are invalid
* The provider's API is unresponsive
* The input or output has been moderated

You could use this attribute in conditions in your conversation design. For example if you had an LLM action to generate some response text but it failed, you could use the `action_success` attribute to [condition](../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) a failure message to let the user know something went wrong. This condition would use the Is True and Is False operations.

### llm\_action\_error

This attribute denotes the reason for a LLM action's failure. `llm_action_error` is a string attribute that can have the following values:

* `prompt_moderation`: This value can only occur when [content moderation](./#content-moderation) is enabled. It is returned if an aspect of the prompt was flagged. The prompt includes any text or attributes you have configured in the system prompt and user prompt, as well as the user's utterance.
* `response_moderation`: This value can only occur when [content moderation](./#content-moderation) is enabled. It is returned if an aspect of the LLM's response was flagged.
* `prompt_exclusion`: This value can only occur when a [user utterance exclusion list](./#user-utterance-response-exclusion-list) is provided. It is returned if the prompt contained any terms in the list. The prompt includes any text or attributes you have configured in the system prompt and user prompt, as well as the user's utterance.
* `response_exclusion`: This value can only occur when a [response utterance exclusion list](./#user-utterance-response-exclusion-list) is provided. It is returned if the LLM's response contained any terms in the list.
* `llm_request_failed`: This value occurs when the request to the LLM fails. This can via misconfiguration, or connection issues. If the action is misconfigured, this value can be returned due to invalid API keys or model names. If the action is configured correctly, this value can be returned due to issues with the LLM provider's API.

You could use this attribute in conditions in your conversation design. For example if you had an LLM action to generate some response text but it failed, you could use the `llm_action_error` attribute to [condition](../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) failure messages to let the user know what went wrong and if/how it can be resolved. These conditions would use the In Set operation, such as "user.llm\_action\_error In Set prompt\_exclusion" to condition a message to only display if the LLM action failed due an excluded term being present in the prompt.

### llm\_action\_flagged\_moderation\_categories

If content moderation is enabled, and the prompt or response has been flagged, then this attribute denotes the flagged categories. `llm_action_flagged_moderation_categories` is a string collection attribute than will contain zero or many categories. The list of possible moderation categories varies between [OpenAI](https://platform.openai.com/docs/guides/moderation/overview) and [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter).

You could use this attribute in conditions in your conversation design. For example if you had an LLM action to generate some response text but it failed due to prompt or response moderation, you could use the `llm_action_flagged_moderation_categories` attribute to [condition](../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) failure messages to let the user know what moderation category was flagged. These conditions would use the In Set operation, such as "user.llm\_action\_flagged\_moderation\_categories In Set violence" to condition a message to only display if the LLM action failed due the violence category being flagged.

### llm\_action\_prompt\_exclusions

If a user utterance exclusion list is provided and any of the terms are found in the prompt, then this attribute denotes the found terms. `llm_action_prompt_exclusions` is a string collection attribute that will contain zero or many excluded terms.

You could use this attribute in conditions in your conversation design. For example if you had an LLM action to generate some response text but it failed, you could use the `llm_action_prompt_exclusions` attribute to [condition](../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) failure messages to let the user know which terms they used matched the exclusion list. These conditions would use the In Set operation, such as "user.llm\_action\_prompt\_exclusions In Set complaint" to condition a message to only display if the prompt contained the term "complaint".

### llm\_action\_response\_exclusions

If a response exclusion list is provided and any of the terms are found in the LLM's response, then this attribute denotes the found terms. `llm_action_response_exclusions` is a string collection attribute that will contain zero or many excluded terms.

You could use this attribute in conditions in your conversation design. For example if you had an LLM action to generate some response text but it failed, you could use the `llm_action_response_exclusions` attribute to [condition](../../../core-concepts/contexts-and-attributes/conditions-and-operators.md) failure messages to let the user know which terms the LLM response used which matched the exclusion list. These conditions would use the In Set operation, such as "user.llm\_action\_response\_exclusions In Set guarantee" to condition a message to only display if the LLM response contained the term "guarantee".

## Configurable output attributes

### llm\_response

The `llm_response` attribute is included by default for all new LLM actions. It is a string attribute which contains the generated text returned by the LLM. This attribute can be removed if it is not required.

You can use this attribute in a message to display the LLM's response.
