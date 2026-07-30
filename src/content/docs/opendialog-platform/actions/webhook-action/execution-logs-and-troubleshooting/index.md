---
title: Execution logs and troubleshooting
---

You can view the execution logs for your webhook action in several ways..

## Using 3-dots menu on the action card

![](</.gitbook/assets/image (609).png>)

* **Aggregate Log Data**: Returns a CSV file that provides aggregated statistics across all your action runs.:
  * Successful Runs
  * Failed Runs
  * Number of times run
  * Average Duration (s)
  * Number of errors
  * Most common error type
  * Number of 2xx responses
  * Number of 3xx responses
  * Number of 4xx responses
  * Number of 5xx responses
* **Detailed Log Data**: Returns a CSV with all action runs containing the following information:
  * Action Duration (s)
  * HTTP Status Code
  * Request URL
  * Request Method
  * Request Headers
  * Request Body
  * Response Headers
  * Response Body
  * Error type and message if any

## Using request visualizer

![](</.gitbook/assets/Screenshot 2025-11-03 at 13.25.37.png>)

In the preview or request logs, navigate to the selected path section to view all executed actions. For webhook actions, a new link allows you to download the action log, which contains the same information as the detailed log data from action card's 3-dot menu, containing log only for this particular execution.
