# Testing strategy

Testing your assistant is a critical part of the success of your application and how the application reflects on your brand.&#x20;

## Types of testing

The different types of testing include the following.&#x20;

* Functional testing
  * Verify that the flow is correct, as designed and described in the journey diagram. E.g. when user selects an option, make sure that the next prompt is as designed
  * Test that integrations work
* NLU testing
  * For intent-based NLU services, test that user utterances that are known (used as sample utterances) are correctly classified (with traditional intent classifier/NLU service). E.g. through automated testing and a confusion matrix
  * When LLMs are used as intent classifiers/extractors, test the prompts/examples
* Coverage testing
  * Get user (and stakeholder) feedback on extent of functionality and use case coverage. E.g. perhaps an outcome that is sent to human to resolve can be handled automatically
  * Generate possible user utterances and test for coverage and correct intent recognition. Generated using LLMs or input from target users
* Usability testing
  * Get user feedback on the ease of use, how intuitive and clear the assistant is, the wording, etc… Is it easy to use, is it useful (USERindex), likelihood to use it again and recommend

## When to test

The motto should be: "Test early and often".&#x20;

The different types of testing need to occur at any point in the development and live stages of your assistant. The following pages describe the types of testing to complete in the different stages of the development lifecycle.&#x20;

The different types of testing can be performed during at any time.

### Prototype testing

Once a prototype is available, testing can start. Some types of testing to undertake are:

* Functional testing to ensure that the conversation flow is correctly implemented and that integrations work as expected
* Usability testing to get user feedback on the interaction with the assistant
* Coverage testing to discover additional utterances and intents that make the NLU interactions more robust

### Testing in development

Functional, usability, intent and coverage testing can all be performed on sprint deliverables.&#x20;

Once a beta version is available, end-to-end testing of the experience becomes feasible and critical.&#x20;

### Testing a live deployment

Once an assistant is live, continued testing is needed.&#x20;

This includes recurring automated testing to ensure continued quality and performance and security, especially following updates or any changes to the system or integrations. &#x20;

Consider running analytics including the Analyze functionality in the OD platform to gather data and improve the robustness of the assistant based on the insights gained from the analytics data.&#x20;

