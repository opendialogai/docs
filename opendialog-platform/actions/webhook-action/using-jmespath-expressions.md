# Using JMESPath expressions

Use **JMESPath expressions** to map and transform JSON response from webhook action into the desired data structure.

<figure><img src="../../../.gitbook/assets/image (611).png" alt=""><figcaption><p>Example of using JMESPath expression in your output attributes mapping</p></figcaption></figure>

Be aware of the following:

* If your JMESPath expression is incorrect or points to non-existent fields, the output attribute value will be empty.
* If the resulting value of your JMESPath does not match the target attribute type, the attribute value will also be empty.

Resources on JMESPath:

* [Official specification](https://jmespath.org/specification.html#jmespath-specification).
* [Comprehensive examples](https://jmespath.org/examples.html).
* [Tutorials](https://jmespath.org/tutorial.html).

### Examples

**Custom function: `json_decode(...)`**

Webhook V2 supports a custom JMESPath function called `json_decode(...)`.

Use it when an API returns JSON **inside a string field** and you need to read values from that encoded object.

Without `json_decode(...)`, string fields are treated as plain text and cannot be traversed with dot notation.

**Syntax:**

```text
json_decode(<json_string_field>)
```

You can combine it with normal JMESPath traversal, for example:

```text
json_decode(payload).order.status
```

If the string is not valid JSON, the result is treated as empty for mapping purposes.

**Example: extract values from a JSON-encoded field**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "eventId": "evt_901",
  "payload": "{\"order\":{\"id\":\"ORD-1007\",\"status\":\"shipped\",\"tracking\":{\"carrier\":\"DHL\",\"number\":\"TRK-7788\"}}}"
}
</code></pre></td><td><p>Expression:<br><code>json_decode(payload).order.tracking.number</code><br><br>Output:</p><pre><code>TRK-7788
</code></pre></td></tr></tbody></table>

**Example: decode and return multiple fields**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "payload": "{\"order\":{\"id\":\"ORD-1007\",\"status\":\"shipped\"}}"
}
</code></pre></td><td><p>Expression:<br><code>{order_id: json_decode(payload).order.id, order_status: json_decode(payload).order.status}</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">{
  "order_id": "ORD-1007",
  "order_status": "shipped"
}
</code></pre></td></tr></tbody></table>

**Select a Single Field**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "name": "Alice",
  "age": 30,
  "city": "London"
}
</code></pre></td><td><p>Expression:<br><code>name</code><br><br>Output:</p><pre><code>Alice
</code></pre></td></tr></tbody></table>

**Access Nested Fields**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "user": {
    "profile": {
      "name": "Charlie",
      "location": "London"
    }
  }
}
</code></pre></td><td><p>Expression:<br><code>user.profile.location</code><br><br>Output:</p><pre><code>London
</code></pre></td></tr></tbody></table>

**Select Multiple Fields**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "id": 123,
  "name": "Bob",
  "email": "bob@example.com",
  "age": 25
}
</code></pre></td><td><p>Expression:<br><code>{name: name, email: email}</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">{
  "name": "Bob",
  "email": "bob@example.com"
}
</code></pre></td></tr></tbody></table>

**Select all array element's properties**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "products": [
    {"name": "Laptop", "price": 999},
    {"name": "Mouse", "price": 25},
    {"name": "Keyboard", "price": 75}
  ]
}
</code></pre></td><td><p>Expression:<br><code>products[*].name</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">[
  "Laptop",
  "Mouse",
  "Keyboard"
]
</code></pre></td></tr></tbody></table>

**Filter array by condition**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "items": [
    {"name": "Apple", "price": 1.5, "inStock": true},
    {"name": "Banana", "price": 0.8, "inStock": false},
    {"name": "Orange", "price": 2.0, "inStock": true}
  ]
}
</code></pre></td><td><p>Expression:<br><code>items[?inStock == `true`]</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">[
  {"name": "Apple", "price": 1.5, "inStock": true},
  {"name": "Orange", "price": 2.0, "inStock": true}
]
</code></pre></td></tr></tbody></table>

**Select root-level array**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">[
  {"id": 1, "name": "Alice", "role": "admin"},
  {"id": 2, "name": "Bob", "role": "user"},
  {"id": 3, "name": "Charlie", "role": "user"}
]
</code></pre></td><td><p>Expression:<br><code>@</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">[
  {"id": 1, "name": "Alice", "role": "admin"},
  {"id": 2, "name": "Bob", "role": "user"},
  {"id": 3, "name": "Charlie", "role": "user"}
]
</code></pre></td></tr></tbody></table>

**Use bult-in functions**

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "items": [
    {"name": "Apple", "price": 15 },
    {"name": "Banana", "price": 999 },
    {"name": "Orange", "price": 75 }
  ]
}
</code></pre></td><td><p>Expression:<br><code>max(products[*].price)</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">999
</code></pre></td></tr></tbody></table>



#### Select array elements for a form message with dynamic data

You can create [a from message with dynamic](../../conversation-designer/message-design/message-types/form-message.md#creating-form-messages-with-dynamic-data) data retrieved from a webhook action. For example:

<table><thead><tr><th>Input JSON</th><th>JMESPath</th></tr></thead><tbody><tr><td><pre class="language-json"><code class="lang-json">{
  "products": [
    {"sku": "LAP-001", "name": "Laptop", "price": 999},
    {"sku": "MOU-002", "name": "Mouse", "price": 25},
    {"sku": "KEY-003", "name": "Keyboard", "price": 75}
  ]
}
</code></pre></td><td><p>Expression:<br><code>products[*].{key: sku, value: name}</code><br><br>Output:</p><pre class="language-json"><code class="lang-json">[
  {"key": "LAP-001", "value": "Laptop"},
  {"key": "MOU-002", "value": "Mouse"},
  {"key": "KEY-003", "value": "Keyboard"}
]
</code></pre></td></tr></tbody></table>

This can then be used as a data source for your searchable select in a form message.







