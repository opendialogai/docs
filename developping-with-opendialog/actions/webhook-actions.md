---
description: >-
  The webhook action allows you to send and receive attributes to/from a webhook
  URL.
---

# Webhook actions

## Developing a Webhook action

### Webhook request structure

```javascript
{
  "input_data": {
    "attributes": {
      "[attribute name]": "[attribute value]"
    }
  }
}
```

### Webhook response structure

#### Successful

```javascript
{
  "successful": true,
  "output_data": {
    "attributes": {
      "full_name": "John Smith"
    }
  }
}
```

#### Unsuccessful

```javascript
{
  "successful": false,
  "errors": [
    {
      "message": "[error message]"
    }
  ]
}
```

### Handling different attribute types

In OpenDialog we support a number of different attribute types and webhook action can be used with more than just key:value pairs.&#x20;

#### Composite Attributes

You can provide information as a JSON object in a reply to an OpenDialog Action. The attribute type within OpenDialog needs to be defined as `JSON Inferred Composite`. This indicates to the OpenDialog engine that it should attempt to infer all the different properties of the JSON object and map them to appropriate attributes.&#x20;

So for example you can provide the following payload as a response&#x20;

```
{
  "successful": true,
  "output_data": {
    "attributes": {
      "policy_info": {
        "number_of_policies": "3",
        "policy1": {
          "type": "motor_policy",
          "name": "John1",
          "surname": "Doe1",
          "policyID": "12345ABC"
        },
        "policy2": {
          "type": "motor_policy",
          "name": "John2",
          "surname": "Doe2",
          "policyID": "12345ABC"
        },
        "policy3": {
          "type": "motor_policy",
          "name": "John3",
          "surname": "Doe3",
          "policyID": "12345ABC"
        }
      }
    }
  }
}
```



OpenDialog will make this attribute available as a composite and you can access specific properties with the syntax `user.policy_info[number_of_policies]` or `user.policy_info[policy2][type]`, from within messages, etc.&#x20;

Attribute Collections

Attribute collections are lists of items. For lists you can declare that the attribute is of a collection type and then present the information as an array within the payload response to the action.&#x20;



```
{
  "successful": true,
  "output_data": {
    "attributes": {
      "collection_example": ["item1", "item2", "item3"],
    }
  }
}
```



You can then access collection data using the index -  for the above it would be `collection_example[0]` for retrieving `item1`, and so on.&#x20;

### Examples

#### Populating attributes

This example models an action which takes first & last name attributes and uses them to populate a full name attribute. As the action response specified that it was successful, this will also automatically populate the `action_success` attribute with `true`.

**Request**

```
{
  "input_data": {
    "attributes": {
      "first_name": "John",
      "last_name": "Smith",
    }
  }
}
```

**Response**

```
{
  "successful": true,
  "output_data": {
    "attributes": {
      "full_name": "John Smith"
    }
  }
}
```

#### Unsetting attributes

This example models a successful action which takes feedback attributes and then returns `null` values for some of them, causing OpenDialog to unset those attributes. It is possible for an action response to both unset and populate attributes, they are not mutually exclusive. As the action response specified that it was successful, this will also automatically populate the `action_success` attribute with `true`.

**Request**

```javascript
{
  "input_data": {
    "attributes": {
      "location": "Bristol",
      "rating": 5,
      "comments": "Great service!"
    }
  }
}
```

**Response**

```javascript
{
  "successful": true,
  "output_data": {
    "attributes": {
      "rating": null,
      "comments": null,
      "referral_code": "ABCXYZ123"
    }
  }
}
```

#### Errors

This example models an unsuccessful action which has returned an error. As the action response specified that it was unsuccessful, this will also automatically populate the `action_success` attribute with `false`. The error message(s) will be automatically added to the logs.

**Request**

```javascript
{
  "input_data": {
    "attributes": {
      "location": "Bristol"
    }
  }
}
```

**Response**

```javascript
{
  "successful": false,
  "errors": [
    {
      "message": "Missing expected attributes: 'rating', 'comments'"
    }
  ]
}
```
