---
title: '[Legacy] External APIs'
---

:::note
These API end points are now considered as legacy in OpenDialog. They will be removed in the future. Use the [new Public APIs](/developing-with-opendialog/public-apis) instead.
:::

## Introduction

This page explains how to interact with OpenDialog via external APIs. It covers exporting user interaction data using `user_id` and generating customised webchat short URLs in bulk.

### Interaction API

The Interaction API makes it possible to retrieve information about interactions between the user and OpenDialog scenarios. The data is requested for over a time period (`from` , `to`) and is split by `user_id`. Example structure can be seen below.

```json showLineNumbers
{
    "data": [
        {
            "<user_id>": {
                "chatbot_user_data": {
                    "first_name": "",
                    "last_name": "",
                    "custom": {
                        "selected_scenario": "<scenario_id>"
                    }
                },
                "from": "2022-09-21T00:00:00.000000Z",
                "to": "2022-09-22T23:59:59.000000Z",
                "interactions": [
                    {
                        "type": "<>",
                        "date": "2022-09-21T08:19:33.000000Z",
                        "text": "",
                        "data": {
                            "value": "<>",
                            "callback_id": "<>"
                        }
                    },
                    {
                        "type": "<>",
                        "date": "2022-09-21T08:19:33.000000Z",
                        "text": "",
                        "data": {
                            "value": "<>",
                            "callback_id": "<>"
                        }
                    }
                ]
            }
        }
    ]
}
```

Please see our [Postman documentation](https://www.postman.com/opendialogai/workspace/opendialog-s-public-workspace/documentation/18689765-415a73ab-291e-43a9-bdb8-aae2eb015f3f?entity=request-18689765-d11214de-8749-48af-9521-172591cf54b3) of the API for further information.

### Webchat Short URL API

The Short URL API makes it possible to generate personalised webchat URLs with pre-filled user attributes by hitting the `api/generate-webchat-deeplink` endpoint. This enables a tailored experience from the moment a user interacts with OpenDialog.

To generate a short URL, provide a `scenarioId` or `scenarioAlias`, along with a `dataset` containing user attributes. If a `userId` is not specified, one will be automatically generated. Example structure can be seen below:

```json
{
  "scenario_id": "<scenarioId>",
  "dataset": [{
    "user_id": "abc123",
    "attributes": {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@opendialog.ai",
     }
   }, {
    "user_id": "123",
    "attributes": {
      "first_name": "First name",
      "last_name": "Last name",
      "PolicyHolders": "Ben Smith, Joe Bloggs, John Smith",
      "email": "first.last@opendialog.ai",
    }
  }]
}
```

Each request returns a set of unique short URLs that pre-load the specified attributes into the conversation.

For detailed request and response specifications, see our [Postman API documentation.](https://www.postman.com/opendialogai/workspace/opendialog-s-public-workspace/documentation/18689765-415a73ab-291e-43a9-bdb8-aae2eb015f3f)

### Bearer Token

To access the API you will need a bearer token associated with a user account in the OpenDialog Tenant you want to extract data from.

To access your bearer token visit the Identity & Security page - accessible by clicking on your username in the bottom left-hand corner.

![](</.gitbook/assets/image (242).png>)

![](/.gitbook/assets/2022-09-21_16-47-08.png)

*API Bearer Token Access*
