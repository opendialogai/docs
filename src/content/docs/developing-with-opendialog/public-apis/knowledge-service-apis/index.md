---
title: Knowledge Service APIs
---

The Knowledge Service APIs allow you to manage knowledge service configurations and topics within your OpenDialog workspace. These endpoints enable programmatic control over the NLU and AI components that power your conversational applications.

### Overview

Knowledge Services use Retrieval Augmented Generation (RAG) to enhance your conversational AI with domain-specific knowledge. By configuring knowledge services, you can:

* Define topics and topic sources for your knowledge base
* Configure embedding and retrieval parameters
* Integrate with language models for intelligent question answering
* Vectorise content for semantic search

For more details on knowledge services and RAG, see the [Language Services documentation](https://docs.opendialog.ai/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation).

### Important Naming Rules

* Knowledge service **names cannot contain spaces**
* Topic **names cannot contain spaces**
* Names must match the pattern: alphanumeric characters, underscores, and hyphens only (`/^[\w\-]+$/`)

### Knowledge Service Configuration

#### List Knowledge Services

Retrieve a list of all knowledge service configurations in your workspace.

**Endpoint:** `GET /public/api/knowledge-service`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "faq_knowledge_service",
      "component_id": "language_processor.core.knowledge_service",
      "scenario_id": "",
      "active": true,
      "type": "knowledge_service",
      "configuration": {
        "description": "Knowledge service for frequently asked questions",
        "type": "knowledge_service",
        "chunk_size": 1000,
        "chunk_overlap": 10,
        "top_k": 3,
        "language_model_component_id": "language_model.core.openai",
        "language_model_configuration": {
          "managed": 1,
          "api_key": "",
          "tasks": {
            "embedding": {
              "model": "text-embedding-3-small"
            }
          }
        }
      },
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  ]
}
```

#### Get Knowledge Service Count

Get the total count of knowledge service configurations.

**Endpoint:** `GET /public/api/knowledge-service-count`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**Response:**

```json
{
  "data": {
    "items_count": 5
  }
}
```

#### Create Knowledge Service

Create a new knowledge service configuration. Knowledge services use a language model for embeddings and manage chunked text sources.

**Endpoint:** `POST /public/api/knowledge-service`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**Request Body:**

```json
{
  "scenario_id": "",
  "name": "this_is_a_new_service",
  "component_id": "language_processor.core.knowledge_service",
  "configuration": {
    "description": "this is the new service description",
    "type": "knowledge_service",
    "chunk_size": 1000,
    "chunk_overlap": 10,
    "top_k": 3,
    "language_model_component_id": "language_model.core.open_ai",
    "language_model_configuration_name": "this_is_a_new_service Language Model",
    "language_model_configuration": {
      "api_key": "",
      "managed": true,
      "tasks": {
        "embedding": {
          "model": "text-embedding-3-small"
        }
      }
    }
  },
  "active": true
}
```

**Request Body Parameters:**

* `name` (string, required) - Name of the knowledge service (must match pattern `/^[\w\-]+$/`)
* `scenario_id` (string, optional) - ID of the associated scenario (empty string if not applicable)
* `component_id` (string, required) - Must be `"language_processor.core.knowledge_service"`
* `active` (boolean, required) - Whether the knowledge service is active
* `configuration` (object, required) - Configuration for the knowledge service

**Configuration Parameters:**

* `description` (string, optional) - Descriptive text about the knowledge service
* `type` (string, required) - Must be `"knowledge_service"`
* `chunk_size` (integer, required) - Size of text chunks for processing (default: 1000)
* `chunk_overlap` (integer, required) - Number of tokens to overlap between chunks (0-100, default: 10)
* `top_k` (integer, required) - Number of top results to return from vector search (minimum: 1, default: 3)
* `language_model_component_id` (string, required) - Component ID of the language model to use for embeddings (e.g., `"language_model.core.open_ai"` or `"language_model.core.azure_openai"`)
* `language_model_configuration_name` (string, required) - A descriptive name for the language model configuration
* `language_model_configuration` (object, required) - Configuration for the language model
  * `managed` (boolean) - Set to `true` for managed (API key provided by system) or `false` for self-managed
  * `api_key` (string) - API key for the language model (required if `managed` is `false`)
  * `tasks` (object) - Task-specific model configurations
    * `embedding` (object) - Embedding model configuration
      * `model` (string) - Model name for embeddings (e.g., `"text-embedding-3-small"`)

**Validation Rules:**

* `name` - Must match pattern `/^[\w\-]+$/` (alphanumeric, underscores, and hyphens only; no spaces)
* `configuration.chunk_size` - Required, integer, minimum value varies based on system configuration
* `configuration.chunk_overlap` - Required, integer, minimum 0, maximum 100
* `configuration.top_k` - Required, integer, minimum 1

**Response:**

```json
{
  "data": {
    "id": 39000003,
    "name": "this_is_a_new_service",
    "component_id": "language_processor.core.knowledge_service",
    "scenario_id": "",
    "active": true,
    "type": "knowledge_service",
    "configuration": {
      "description": "this is the new service description",
      "type": "knowledge_service",
      "chunk_size": 1000,
      "chunk_overlap": 10,
      "top_k": 3,
      "language_model_component_id": "language_model.core.open_ai",
      "language_model_configuration_name": "this_is_a_new_service Language Model",
      "language_model_configuration": {
        "api_key": "",
        "managed": true,
        "tasks": {
          "embedding": {
            "model": "text-embedding-3-small"
          }
        }
      }
    },
    "created_at": "2025-11-18T15:40:37.000000Z",
    "updated_at": "2025-11-18T15:40:37.000000Z",
    "scenario_count": 0
  }
}
```

#### Get Knowledge Service

Retrieve a specific knowledge service configuration by ID.

**Endpoint:** `GET /public/api/knowledge-service/{id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `id` (required) - The ID of the knowledge service configuration

**Response:**

```json
{
  "data": {
    "id": 1,
    "name": "faq_knowledge_service",
    "component_id": "language_processor.core.knowledge_service",
    "scenario_id": "",
    "active": true,
    "type": "knowledge_service",
    "configuration": {
      "description": "Knowledge service for FAQ",
      "type": "knowledge_service",
      "chunk_size": 1000,
      "chunk_overlap": 10,
      "top_k": 3,
      "language_model_component_id": "language_model.core.openai",
      "language_model_configuration": {
        "managed": 1,
        "api_key": "",
        "tasks": {
          "embedding": {
            "model": "text-embedding-3-small"
          }
        }
      }
    },
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

#### Delete Knowledge Service

Remove a knowledge service configuration.

**Endpoint:** `DELETE /public/api/knowledge-service/{id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `id` (required) - The ID of the knowledge service configuration

**Response:** `204 No Content`

### Knowledge Service Topics

#### List Topics

Retrieve all topics for a specific knowledge service.

**Endpoint:** `GET /public/api/language-processor/{knowledge_service_id}/language-processor-topic`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `knowledge_service_id` (required) - The ID of the knowledge service

**Query Parameters:**

* `search` (optional) - Search topics by name
* `order_by` (optional) - Field to order by (default: `created_at`)
* `order_dir` (optional) - Sort direction: `asc` or `desc` (default: `desc`)
* `per_page` (optional) - Number of results per page (default: 15)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Information",
      "description": "Information about our products",
      "dataset_id": 1,
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z",
      "sources": []
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

#### Create Topic

Create a new topic for a knowledge service.

**Endpoint:** `POST /public/api/language-processor/{language_processor_id}/language-processor-topic`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service

**Request Body:**

```json
{
  "name": "product_information",
  "description": "Information about our products",
  "topic_type": "vectorised"
}
```

**Validation Rules:**

* `name` - Must match pattern `/^[\w\-]+$/` (alphanumeric, underscores, and hyphens only; no spaces)
* `topic_type` - Must be either `vectorised` or `static_text`

**Response:**

```json
{
  "data": {
    "id": 2,
    "name": "product_information",
    "description": "Information about our products",
    "dataset_id": 1,
    "created_at": "2024-01-15T11:00:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z"
  }
}
```

#### Get Topic

Retrieve a specific topic.

**Endpoint:** `GET /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Response:**

```json
{
  "data": {
    "id": 1,
    "name": "Product Information",
    "description": "Information about our products",
    "dataset_id": 1,
    "topic_type": "vectorised",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

#### Update Topic

Update an existing topic.

**Endpoint:** `PUT /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Request Body:**

```json
{
  "name": "updated_topic_name",
  "description": "Updated description",
  "topic_type": "vectorised"
}
```

**Validation Rules:**

* `name` - Must match pattern `/^[\w\-]+$/` (alphanumeric, underscores, and hyphens only; no spaces)
* `topic_type` - Must be either `vectorised` or `static_text`

**Response:** `204 No Content`

### Topic Sources

Topic sources are the actual content that gets embedded and vectorised for semantic search within a knowledge service. Sources can be text content, documents, or other data that you want to make searchable through the knowledge service.

Topics with a type of `static_text` only support a single `text` type topic source that cannot be vectorised.

#### List Topic Sources

Retrieve all sources for a specific topic.

**Endpoint:** `GET /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}/language-processor-topic-source`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

#### Create Topic Source

Add a new source to a topic. Topic sources contain the actual content to be vectorised and made searchable.

**Endpoint:** `POST /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}/language-processor-topic-source`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Request Body:**

Topic sources support three different types: `text`, `url`, and `file`. Below are examples for each type:

**Text Type**

```json
{
  "type": "text",
  "configuration": {
    "name": "Some text",
    "source": "This is some text source"
  }
}
```

**URL Type**

```json
{
  "type": "url",
  "configuration": {
    "source": "https://opendialog.ai",
    "name": "opendialog.ai",
    "exclusion_classes": [
      "exclude_class"
    ],
    "exclusion_ids": [
      "exclude_id"
    ],
    "should_strip_tags": true
  }
}
```

**File Type**

```json
{
  "type": "file",
  "configuration": {
    "source": "file_upload.txt",
    "name": "file_upload"
  },
  "file": {
    "file": "data:text/plain;base64,PGZpbGUtdXBsb2FkPi4uLg==",
    "file_name": "file_upload.txt",
    "type": "text/plain"
  }
}
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "topic_id": 1,
    "type": "text",
    "configuration": {
      "name": "Some text",
      "source": "This is some text source"
    },
    "created_at": "2024-01-15T11:00:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z"
  }
}
```

#### Get Topic Source

Retrieve a specific topic source by ID.

**Endpoint:** `GET /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}/language-processor-topic-source/{topic_source_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic
* `topic_source_id` (required) - The ID of the topic source

**Response:**

```json
{
  "data": {
    "id": 1,
    "topic_id": 1,
    "type": "text",
    "configuration": {
      "name": "Some text",
      "source": "This is some text source",
      "vectorisation_status": "pending",
      "exclusion_classes": [],
      "exclusion_ids": [],
      "should_strip_tags": false,
      "is_truncated": false,
      "allow_truncation": false,
      "next_vectorisation": null,
      "vectorisation_interval": null,
      "vectorisation_period": null,
      "last_vectorised": null,
      "will_revectorise": false
    },
    "created_at": "2024-01-15T11:00:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z"
  }
}
```

**Configuration Parameters:**

* `vectorisedtype` (string, required) - Type of source: `text`, `url`, or `file`
* `source` (string, required) - The source content or identifier (text content, URL, or filename for file type)
* `name` (string, optional) - A descriptive name for the source
* `exclusion_classes` (array, optional) - List of CSS/HTML classes to exclude during processing (URL type)
* `exclusion_ids` (array, optional) - List of element IDs to exclude during processing (URL type)
* `should_strip_tags` (boolean, optional) - Whether to strip HTML/XML tags during processing (URL and file types)
* `file` (object, optional) - File metadata (required for file type)
  * `file` (string) - Base64-encoded file content with data URI prefix
  * `file_name` (string) - Original filename
  * `type` (string) - MIME type of the file (e.g., "text/plain", "application/pdf")
* `vectorisation_status` (string) - Current vectorisation status: `pending`, `in_progress`, `completed`, `failed`, or `obsolete`
* `next_vectorisation` (timestamp, optional) - Scheduled time for next vectorisation
* `vectorisation_interval` (integer, optional) - Interval in seconds between auto-vectorisations
* `vectorisation_period` (string, optional) - Time period for vectorisation scheduling
* `is_truncated` (boolean) - Whether the source content was truncated
* `allow_truncation` (boolean) - Whether truncation is allowed for this source
* `last_vectorised` (timestamp, optional) - When this source was last vectorised
* `will_revectorise` (boolean) - Whether the source will be re-vectorised

**Vectorisation Status Values:**

* `Vectorisationpending` - Source waiting to be vectorised
* `in_progress` - Source is currently being vectorised
* `completed` - Source has been successfully vectorised
* `failed` - Vectorisation failed for this source
* `obsolete` - Source content changed; vectorisation is outdated

#### Delete Topic Source

Remove a topic source from a topic.

**Endpoint:** `DELETE /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}/language-processor-topic-source/{topic_source_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic
* `topic_source_id` (required) - The ID of the topic source

**Response:** `204 No Content`

#### Vectorise Topic

Trigger vectorisation for a topic.

**Endpoint:** `POST /public/api/language-processor/{language_processor_id}/language-processor-topic/{topic_id}/vectorise`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Response:**

```json
{
  "message": "Topic vectorization initiated"
}
```

### Unified Topic Management

The unified topic endpoints provide simplified topic management operations for knowledge services. These endpoints allow you to create, retrieve, and update topics along with their sources in a single operation.

#### Create Unified Topic

Create a new topic with associated sources in a single request.

**Endpoint:** `POST /public/api/language-processor/{language_processor_id}/language-processor-topics`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service

**Request Body:**

```json
{
  "name": "test_topic",
  "description": "test_description",
  "topic_type": "vectorised",
  "sources": [
    {
      "type": "text",
      "configuration": {
        "source": "test_text"
      }
    },
    {
      "type": "text",
      "configuration": {
        "source": "test_text2"
      }
    }
  ]
}
```

**Request Body Parameters:**

* `name` (string, required) - Name of the topic (must match pattern `/^[\w\-]+$/`)
* `description` (string, required) - Description of the topic
* `topic_type` - Must be either `vectorised` or `static_text`
* `sources` (array, required) - Array of topic sources to create with this topic (minimum 1 source required)
  * `type` (string, required) - Type of source: `text`, `url`, or `file`
  * `configuration` (object, required) - Configuration for the source
    * `source` (string, required) - The source content, URL, or filename
    * `name` (string, optional) - A descriptive name for the source
    * `exclusion_classes` (array, optional) - List of CSS/HTML classes to exclude (for URL type)
    * `exclusion_ids` (array, optional) - List of element IDs to exclude (for URL type)
    * `should_strip_tags` (boolean, optional) - Whether to strip HTML/XML tags (for URL and file types)

**Response:** `204 No Content`

#### Get Unified Topic

Retrieve a specific topic with all its associated sources.

**Endpoint:** `GET /public/api/language-processor/{language_processor_id}/language-processor-topics/{topic_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Response:**

```json
{
  "data": {
    "id": 1,
    "name": "test_topic",
    "description": "test_description",
    "dataset_id": 1,
    "status": "active",
    "sources": [
      {
        "id": 1,
        "topic_id": 1,
        "type": "text",
        "configuration": {
          "source": "test_text",
          "name": "test_text",
          "vectorisation_status": "pending",
          "exclusion_classes": [],
          "exclusion_ids": [],
          "should_strip_tags": false,
          "is_truncated": false,
          "allow_truncation": false,
          "next_vectorisation": null,
          "vectorisation_interval": null,
          "vectorisation_period": null,
          "last_vectorised": null,
          "will_revectorise": false
        },
        "created_at": "2025-11-18T15:40:37.000000Z",
        "updated_at": "2025-11-18T15:40:37.000000Z"
      },
      {
        "id": 2,
        "topic_id": 1,
        "type": "text",
        "configuration": {
          "source": "test_text2",
          "name": "test_text2",
          "vectorisation_status": "pending",
          "exclusion_classes": [],
          "exclusion_ids": [],
          "should_strip_tags": false,
          "is_truncated": false,
          "allow_truncation": false,
          "next_vectorisation": null,
          "vectorisation_interval": null,
          "vectorisation_period": null,
          "last_vectorised": null,
          "will_revectorise": false
        },
        "created_at": "2025-11-18T15:40:37.000000Z",
        "updated_at": "2025-11-18T15:40:37.000000Z"
      }
    ],
    "created_at": "2025-11-18T15:40:37.000000Z",
    "updated_at": "2025-11-18T15:40:37.000000Z"
  }
}
```

#### Update Unified Topic

Update a topic and manage its sources (update, remove, or add sources) in a single request.

**Endpoint:** `PATCH /public/api/language-processor/{language_processor_id}/language-processor-topics/{topic_id}`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**URL Parameters:**

* `language_processor_id` (required) - The ID of the knowledge service
* `topic_id` (required) - The ID of the topic

**Request Body:**

```json
{
  "name": "test_topic_updated",
  "description": "test_description_updated",
  "sources": [
    {
      "id": 1,
      "operation": "update",
      "type": "text",
      "configuration": {
        "source": "test_text_updated"
      }
    },
    {
      "id": 2,
      "operation": "remove"
    },
    {
      "operation": "add",
      "type": "text",
      "configuration": {
        "source": "test_text3"
      }
    }
  ]
}
```

**Request Body Parameters:**

* `name` (string, optional) - Updated name of the topic
* `description` (string, optional) - Updated description of the topic
* `sources` (array, optional) - Array of source operations
  * `id` (integer) - ID of the source (required for `update` and `remove` operations, omit for `add`)
  * `operation` (string, required) - Operation to perform: `add`, `update`, or `remove`
  * `type` (string) - Type of source: `text`, `url`, or `file` (required for `add` and `update` operations)
  * `configuration` (object) - Configuration for the source (required for `add` and `update` operations)
    * `source` (string, required) - The source content, URL, or filename
    * `name` (string, optional) - A descriptive name for the source
    * `exclusion_classes` (array, optional) - List of CSS/HTML classes to exclude (for URL type)
    * `exclusion_ids` (array, optional) - List of element IDs to exclude (for URL type)
    * `should_strip_tags` (boolean, optional) - Whether to strip HTML/XML tags (for URL and file types)

**Response:** `204 No Content`

**Example: Adding a URL source to an existing topic**

```json
{
  "sources": [
    {
      "operation": "add",
      "type": "url",
      "configuration": {
        "source": "https://example.com",
        "name": "example.com",
        "exclusion_classes": ["nav", "footer"],
        "exclusion_ids": ["sidebar"],
        "should_strip_tags": true
      }
    }
  ]
}
```

**Example: Updating an existing source and adding a new file source**

```json
{
  "sources": [
    {
      "id": 5,
      "operation": "update",
      "type": "text",
      "configuration": {
        "source": "Updated text content here",
        "name": "Updated Text Source"
      }
    },
    {
      "operation": "add",
      "type": "file",
      "configuration": {
        "source": "document.pdf",
        "name": "PDF Document"
      },
      "file": {
        "file": "data:application/pdf;base64,JVBERi0xLjQK...",
        "file_name": "document.pdf",
        "type": "application/pdf"
      }
    }
  ]
}
```

### Error Responses

All endpoints may return the following error responses:

**401 Unauthorized**

```json
{
  "message": "Unauthenticated."
}
```

**403 Forbidden**

```json
{
  "message": "This action is unauthorized."
}
```

**404 Not Found**

```json
{
  "message": "Resource not found."
}
```

**422 Unprocessable Entity**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```
