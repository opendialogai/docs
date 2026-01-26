# Attribute Filters

It may be necessary to filter or modify the value of an attribute before it is used in a message or elsewhere. To help with this, OpenDialog provides a number of built-in filters to use when referencing attributes.

## How to Use Filters

Filters are applied to attributes using a pipe (`|`) and they can be chained together with the result of a filter being passed through into the next filter. For instance:&#x20;

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

### Number Filters

* `number_to_words` - turns a number into its word. eg 1 => 'one'
* `ordinal` - returns the ordinal of the number. eg 1 => 1st
* `ordinal_words` - returns the ordinal spelt out. eg 1 => 'first'

### Date Time Filters

*   `format_date [format] [timezone]` — Converts a Unix `timestamp` or a `date time` string into a human-readable format, applying the specified time zone.

    * The first parameter, `[format]`, specifies the output format using standard PHP date format codes. For example:
      * `"Y-m-d"` → `2025-07-23`
      * `"l jS F"` → `Wednesday 23rd July`\
        A full list of supported format characters can be found [here](https://www.php.net/manual/en/datetime.format.php#refsect1-datetime.format-parameters).
    * The second parameter, `[timezone]`**,** is optional and defines the time zone used for formatting. For instance, using `"Europe/London"` will format the date time according to London time. You can find a list of valid time zone identifiers [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).\
      If omitted, the user's browser time zone will be used by default.

    Example usage:\
    `{date_attribute | format_date "Y-m-d H:i:s" "Europe/London"}`

### Collection Filters

* `count` - returns the number of items in a collection type attribute
* `where [field] [value] [operation?]` - filters out elements based on a field and a value, such as `{ history.utterances | where participant user }` to get all of the user utterances in the conversation history
* `range [start] [number]` - returns a subset of the collection, such as `{history.intents | range -3 2 }` to get the second and third from last intent names in the conversation history.
* `last` - returns the last element of the collection.

### Conversation Object Filters

* `select [field]` - selects a name or description from a conversation object, such as `{ conversation.current_conversation | select name }`. These attributes can be found within the [Conversation context](contexts.md).

### Encoding Filters

#### url_encode

URL encodes a string value.

| Parameter | Description |
|-----------|-------------|
| *(none)* | Standard URL encoding using PHP's `urlencode()` |
| `true` | RFC 3986 strict encoding - additionally encodes `!'()*~` characters |

**Examples:**

```
{attr | url_encode}         # Standard: "hello world" → "hello+world"
{attr | url_encode true}    # RFC 3986: "hello world" → "hello%20world"
```

{% hint style="info" %}
Use RFC 3986 mode (`true`) when generating signatures for OAuth, HMAC authentication, or APIs that require strict RFC 3986 compliance. This ensures characters like `'`, `!`, `(`, `)`, `*`, `~` are percent-encoded.
{% endhint %}

#### url_decode

URL decodes a string value.

| Parameter | Description |
|-----------|-------------|
| *(none)* | Standard URL decoding using PHP's `urldecode()` |

**Examples:**

```
{attr | url_decode}    # "hello%20world" → "hello world"
                       # "hello+world" → "hello world"
```

#### base64

Base64 encodes or decodes a string value.

| Parameter | Description |
|-----------|-------------|
| *(none)* | Encode (default) |
| `-e` | Encode (explicit) |
| `-d` | Decode |

**Examples:**

```
{attr | base64}           # Encode: "hello" → "aGVsbG8="
{attr | base64 -e}        # Encode (explicit): same as above
{attr | base64 -d}        # Decode: "aGVsbG8=" → "hello"
```

{% hint style="info" %}
Base64 encoding of an empty string returns an empty string, so no special handling is needed for empty bodies.
{% endhint %}

### Cryptographic Filters

#### md5

Computes MD5 hash of a string value. **Outputs raw binary** (16 bytes).

| Parameter | Description |
|-----------|-------------|
| *(none)* | Raw binary MD5 hash output |
| `true` | Preserve empty input - returns empty string if input is empty |

**Examples:**

```
{attr | md5}                  # Raw binary MD5 (16 bytes)
{attr | md5 | base64}         # Base64-encoded MD5: "hello" → "XUFAKrxLKna5cZ2REBfFkg=="
{attr | md5 true}             # Preserve empty: "" → ""
{attr | md5 true | base64}    # For GET requests with empty body
```

{% hint style="info" %}
Raw binary output allows maximum flexibility - pipe to `base64` for base64 encoding, or use directly if the consuming system expects binary.
{% endhint %}

#### hmac

Computes HMAC (Hash-based Message Authentication Code) signature. **Outputs raw binary**.

| Parameter | Position | Description |
|-----------|----------|-------------|
| algorithm | 1st | Hash algorithm: `sha256`, `sha512`, `sha1`, `md5` |
| key | 2nd | Secret key value (use `@` prefix for attribute reference) |
| key_encoding | 3rd | How the key is encoded: `text`, `base64`, `hex` |

**Examples:**

```
# Basic usage with text key
{attr | hmac sha256 my_secret_key text | base64}

# Key from context attribute (using @ notation)
{attr | hmac sha256 @context.secretKey text | base64}

# Base64-encoded key (decoded before use)
{attr | hmac sha256 c2VjcmV0 base64 | base64}

# Hex-encoded key
{attr | hmac sha256 736563726574 hex | base64}

# Different algorithms
{attr | hmac sha512 key text | base64}
{attr | hmac md5 key text | base64}
```

**Key encoding options:**
- `text` - Key is used as-is (most common)
- `base64` - Key is base64-decoded before use
- `hex` - Key is hex-decoded before use

### String Manipulation Filters

#### replace

Replaces occurrences of a search string with a replacement string.

| Parameter | Position | Description |
|-----------|----------|-------------|
| search | 1st | String to search for (use `@` prefix for attribute reference) |
| replacement | 2nd | String to replace with (use `@` prefix for attribute reference) |

**Examples:**

```
# Literal replacement
{attr | replace "'" "%27%27"}           # Escape single quotes
{attr | replace " " "_"}                # Replace spaces with underscores
{attr | replace "old" "new"}            # Simple substitution

# Search value from attribute (using @ notation)
{attr | replace @user.searchTerm "REDACTED"}

# Replacement from attribute
{attr | replace "placeholder" @context.value}

# Both from attributes
{attr | replace @user.find @user.replaceWith}
```

## Dynamic Parameters with @ Notation

Any filter parameter can reference an OpenDialog attribute value by prefixing it with `@`. This provides a generic, consistent way to pass dynamic values to filters.

### Syntax

```
{attr | filter_name @context.attribute_name}     # From specified context
{attr | filter_name @attribute_name}             # From user context (default)
{attr | filter_name @session.data['field']}      # Composite with accessors (use single quotes)
{attr | filter_name @}                           # Lone @ is literal (not resolved)
{attr | filter_name literal_value}               # No @ prefix = literal value
```

### Examples

```
{text | replace @session.search_term "REDACTED"}          # Search from attribute
{text | replace "placeholder" @user.replacement}          # Replace from attribute
{body | hmac sha256 @context.secretKey text | base64}     # HMAC key from attribute
{date | format_date @session.format @user.timezone}       # Format and TZ from attributes
{list | last @session.count}                              # Dynamic collection slice
{list | where status @user.filter_status}                 # Dynamic where filter
```

{% hint style="warning" %}
Use **single quotes** for composite attribute accessors: `@session.data['field']` (double quotes conflict with filter parameter grouping).
{% endhint %}

## Example: HMAC Authentication Headers

The encoding and cryptographic filters can be chained together to construct HMAC authentication headers for API integrations:

```json
{
    "type": "variable_headers",
    "headers": {
      "Authorization": "HMAC {user.appId}:{_auth.signature}:{_auth.nonce}:{_auth.timestamp}"
    },
    "variables": {
      "url_encoded": "{_webhook.url | replace \"'\" \"%27%27\"}",
      "base_url": "{_auth.url_encoded | lowercase | url_encode true | lowercase}",
      "body_hash": "{_webhook.body | md5 true | base64}",
      "raw_signature": "{user.appId}{_auth.timestamp}{_auth.nonce}{_auth.body_hash}{_webhook.method}{_auth.base_url}",
      "signature": "{_auth.raw_signature | hmac sha256 @context.secretKey text | base64}"
    }
}
```

For video lessons and hands-on practice with these concepts, consider signing up for the OpenDialog Academy lessons by emailing academy@opendialog.ai.&#x20;
