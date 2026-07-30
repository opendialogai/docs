---
title: Attribute Filters
---

It may be necessary to filter or modify the value of an attribute before it is used in a message or elsewhere. To help with this, OpenDialog provides a number of built-in filters to use when referencing attributes.

## How to Use Filters

Filters are applied to attributes using a pipe (`|`) and they can be chained together with the result of a filter being passed through into the next filter. For instance:

```
{ user.age | number_to_words | uppercase_first }
```

The above takes the value of the `age` attribute in the `user` context, converts the number to words and adds an uppercase the first letter. If `age` was 30, the value placed in the message would be 'Thirty'.

## Available Filters

### String Filters

* `uppercase` - uppercases all letters in the string
* `uppercase_words` - uppercases the first letter of each word in the string
* `uppercase_first` - uppercases only the first letter in the string
* `lowercase` - lowercases the entire string
* `replace [search] [replacement]` - replaces occurrences of a search string with a replacement string. Example: `{attr | replace "old" "new"}`

### Number Filters

* `number_to_words` - turns a number into its word. eg 1 => 'one'
* `ordinal` - returns the ordinal of the number. eg 1 => 1st
* `ordinal_words` - returns the ordinal spelt out. eg 1 => 'first'

### Date Time Filters

* `format_date [format] [timezone]` - converts a Unix timestamp or date time string into a human-readable format. Example: `{date_attribute | format_date "Y-m-d" "Europe/London"}`
  * `[format]` - output format using [PHP date format codes](https://www.php.net/manual/en/datetime.format.php#refsect1-datetime.format-parameters) (e.g. `"Y-m-d"` → `2025-07-23`, `"l jS F"` → `Wednesday 23rd July`)
  * `[timezone]` - optional, time zone identifier from [this list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to user's browser time zone.

### Collection Filters

* `count` - returns the number of items in a collection type attribute
* `last` - returns the last element of the collection
* `where [field] [value] [operation?]` - filters elements based on a field and value. Example: `{ history.utterances | where participant user }`
* `range [start] [number]` - returns a subset of the collection. Example: `{history.intents | range -3 2 }` returns the second and third from last items.

### Conversation Object Filters

* `select [field]` - selects a field from a conversation object, such as `{ conversation.current_conversation | select name }`. See [Conversation context](/core-concepts/contexts-and-attributes/contexts) for available attributes.

### Encoding Filters

* `url_encode` - URL encodes a string. Use `url_encode true` for RFC 3986 strict encoding (required for OAuth/HMAC signatures).
* `url_decode` - URL decodes a string
* `base64` - Base64 encodes a string. Use `base64 -d` to decode.

### Cryptographic Filters

* `md5` - computes MD5 hash (raw binary output). Use `md5 true` to preserve empty input. Typically chained: `{attr | md5 | base64}`
* `hmac [algorithm] [key] [key_encoding]` - computes HMAC signature (raw binary output). Typically chained: `{attr | hmac sha256 @context.secretKey text | base64}`
  * `[algorithm]` - `sha256`, `sha512`, `sha1`, or `md5`
  * `[key]` - secret key value (use `@` prefix for attribute reference)
  * `[key_encoding]` - `text` (default), `base64`, or `hex`

## Dynamic Parameters with @ Notation

Any filter parameter can reference an OpenDialog attribute value by prefixing it with `@`:

```
{attr | filter_name @context.attribute_name}     # From specified context
{attr | filter_name @attribute_name}             # From user context (default)
{attr | filter_name @session.data['field']}      # Composite with accessors (use single quotes)
```

Examples:

```
{text | replace @session.search_term "REDACTED"}
{body | hmac sha256 @context.secretKey text | base64}
{date | format_date @session.format @user.timezone}
{list | where status @user.filter_status}
```

:::caution
Use **single quotes** for composite attribute accessors: `@session.data['field']` (double quotes conflict with filter parameter grouping).
:::
