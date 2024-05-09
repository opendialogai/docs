# OpenAI interpreter

The OpenAI interpreter allows us to use OpenAI's models to perform text generation. This model does not classify intents or extract entities, if you require this functionality please see Language Services.

This interpreter will return a single intent with the name of `OpenAIPrompt`. It could also return no intents, which would cause a no match as described below.

## Requirements

To use OpenAI's you'll need to [create an account](https://platform.openai.com/) with OpenAI. Once you are signed up, you'll need to [create an API key](https://platform.openai.com/api-keys) via the "API keys" screen. You'll need to keep note of the generated API key for the next step.

<figure><img src="../../.gitbook/assets/Screenshot 2024-01-09 at 09.56.45.png" alt=""><figcaption><p>The API keys screen in OpenAI.</p></figcaption></figure>

## Create the OpenAI interpreter

In your OpenDialog application, navigate to the desired scenario, and then the "Interpret" screen. Click the blue "Add new interpreter" button to begin creating the new interpreter. You will then see the following screen where you can give the interpreter a name and configure it. You will need to select the OpenAI option under "Interpreter Type".

<figure><img src="../../.gitbook/assets/Screenshot 2024-01-09 at 09.58.23.png" alt=""><figcaption><p>Creating an OpenAI interpreter in OpenDialog.</p></figcaption></figure>

Select the desired model from the list under "Model name". Paste the API key you generated previously into the "API token" field. You can also configure the confidence field to a value between 0 and 1, which will set the returned intent confidence. The "Prompt engineering" field allows you to configure the system prompt of the model. At this point you have filled in all the required fields, and will be able to validate the interpreter's connection in the "Check Interpreter Setup" component in the bottom right.

### Optional fields

* [Max tokens](https://platform.openai.com/docs/api-reference/chat/create#chat-create-max\_tokens)
* [Temperature](https://platform.openai.com/docs/api-reference/chat/create#chat-create-temperature)
* [Frequency penalty](https://platform.openai.com/docs/api-reference/chat/create#chat-create-frequency\_penalty)
* [Presence penalty](https://platform.openai.com/docs/api-reference/chat/create#chat-create-presence\_penalty)
* [Top P](https://platform.openai.com/docs/api-reference/chat/create#chat-create-top\_p)
* [Number of generations per prompt](https://platform.openai.com/docs/api-reference/chat/create#chat-create-n)
* No-match response: This field allows you to specify a value that will cause the interpreter to return no matching intents. For example, you can configure the prompt to return "N/A" if the question isn't relevant, and then you can configure the No-match response field as "N/A". The interpreter would then not return the `OpenAIPrompt` which allows for a no-match (if no other interpreters match the intent).
* Should left-hand whitespace and punctuation be trimmed from the response?: This field allows you to decide if the interpreter should remove any whitespace or punctuation from the left-hand side of the response. This can be useful for older models that are more focused on pure completitions rather than chat competitions.

### Attributes Returned

There are several attributes that can be returned by this interpreter that need to be taken into consideration. Some of the data returned is not suitable for displaying to users of your conversational interface and messages should be constructed taking these into account.

**+ gpt\_response:** This field holds the response message back from OpenAI. It should be used in messages back to the user where the response is successful and not moderated. It can be included in messages with standard [OpenDialog Attribute annotation](broken-reference).

\+ **is\_gpt\_response\_moderated:** A boolean attribute that signifies whether the response or request was moderated. In this case, **gpt\_response** should not be shown to a user. Messages or intents can be filtered using [OpenDialog Conditions](../conditions-and-operators.md)

\+ **is\_gpt\_response\_successful:** A boolean attribute that signifies whether the request was successful or had an error during processing. In this case, **gpt\_response** should not be shown to a user. Messages or intents can be filtered using [OpenDialog Conditions](../conditions-and-operators.md)

\+ **gpt\_moderation\_response**: This holds debugging information about the nature of the moderation. It should not be reflected back to the user, but can be useful to see during development

**+ gpt\_quota\_limit\_response**: As above,  but refers specifically to a quote limit response

**+ gpt\_exception\_response**: As above,  but refers to more generic exception data
