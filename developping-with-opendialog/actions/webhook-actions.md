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
