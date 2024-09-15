# LLM Action Analytics

Every LLM Action is logged and you can download those Logs directly from the action.&#x20;

<figure><img src="../../../.gitbook/assets/image.png" alt=""><figcaption><p>Aggregate and Detail LLM Action log data</p></figcaption></figure>

**Aggregate Log Data** will provide the following top level coutns

* Action Name
* Successful Runs
* Failed Runs
* Number of times run
* Average duration
* Average tokens
* Average input tokens
* Average output tokes
* Average moderation duration
* Total duration
* Total moderation duration
* Total tokens
* Total input tokens
* Total output tokens

**Detailed log data** will instead provide for every LLM action run the following information

* Action name
* Action run time
* Duration
* Total tokens
* Input tokens
* Output tokens
* User prompt
* System prompt
* llm\_response value (default output value)
* Moderation duration
* % of moderation as part of the total duration
* All other output attribute values
