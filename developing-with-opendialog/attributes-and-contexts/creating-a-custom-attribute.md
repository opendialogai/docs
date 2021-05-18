---
description: How to create your own attributes
---

# Creating a Custom Attribute

There ar\e two ways to create a custom attribute. You can create one through the interface or do it entirely programmatically. 

## Through the interface

Visit `admin/dynamic-attributes` and create a new attribute selecting one of the existing types. 

![Creating a custom attribute](../../.gitbook/assets/image%20%2888%29.png)

![Dynamic Attributes](../../.gitbook/assets/image%20%2883%29.png)

{% hint style="info" %}
The user interface has yet to be updated to match the 1.x style but the functionality will remain the same 🙂.
{% endhint %}

Now, that you have a custom attribute you can refer to it through the Conversation Designer

![Using custom attributes](../../.gitbook/assets/image%20%2881%29.png)

## Programmatically

To programmatically create an attribute you will need to provide an Attribute implementation. 

Before starting an attribute ensure that you publish the AttributeEngine configurations to the main OpenDialog application. 

From the root of your app call:

```bash
php artisan vendor:publish --provider="OpenDialogAi\AttributeEngine\AttributeEngineServiceProvider"
```

This will publish the Attribute config file `attribute_engine` in `config\opendialog` .

Let's have a look at the config file.

{% code title="attribute\_engine.php" %}
```php
<?php

return [
    /**
     * Register your application specific attribute types here. They should be registered as:
     * [
     *   Fully/Qualified/ClassName,
     *   Fully/Qualified/ClassName2,
     *   ...
     * ]
     *
     * Where ClassName is an implementation of @see \OpenDialogAi\AttributeEngine\Attributes\AttributeInterface
     */
    'custom_attribute_types' => [
//        \OpenDialogAi\AttributeEngine\Tests\ExampleCustomAttributeType::class
    ],

    /**
     * Register your application specific attributes here. They should be registered with:
     * {attribute_name} => Fully/Qualified/ClassName
     *
     * Where ClassName is an implementation of @see \OpenDialogAi\AttributeEngine\Attributes\AttributeInterface
     */
    'custom_attributes' => [
        // 'attribute_name' => AttributeTypeClass::class
    ],
];
    
```
{% endcode %}

There are two types of things we can register. 

### Custom attribute types

A custom attribute type is useful if you are introducing a type not already supported. You can see in the AttributeEngine config that we already support the following:

```php
    'supported_attribute_types' => [
        BooleanAttribute::class,
        FloatAttribute::class,
        IntAttribute::class,
        StringAttribute::class,
        TimestampAttribute::class,
        UserAttribute::class,
        UtteranceAttribute::class,
        FormDataAttribute::class,
        ArrayDataAttribute::class,
        UserHistoryRecord::class,
        BasicCompositeAttribute::class,
    ],
```

You can use a custom type to finely control how the attribute is transformed to a string when displayed in messages or how it is serialised for storage.

Here is an example of a custom attribute type

```php
<?php


namespace App\Bot\Attributes;

use OpenDialogAi\AttributeEngine\Attributes\StringAttribute;
use OpenDialogAi\Core\Components\ODComponentTypes;

/**
 * ExperienceAttribute implementation.
 */
class ExperienceAttribute extends StringAttribute
{
    protected static string $componentId = 'attribute.app.experience';
    protected static string $componentSource = ODComponentTypes::APP_COMPONENT_SOURCE;
}

```

It is stored in our application namespace.

We can then register it in the `config\opendialog\attribute_engine.php` config file. 

```php
    'custom_attribute_types' => [
//      \OpenDialogAi\AttributeEngine\Tests\ExampleCustomAttributeType::class
        \App\Bot\Attributes\ExperienceAttribute::class
    ],
```

### Custom Attribute

A custom attribute can use an existing type or a custom attribute type. 

For example, to register a custom attribute that uses the type above we can add it to our configuration. 

```php
    'custom_attributes' => [
        // 'attribute_name' => AttributeTypeClass::class
        'experience_from_code' => \App\Bot\Attributes\ExperienceAttribute::class
    ],
```

Now, when we try to access attributes we will see our new attribute show up!

![](../../.gitbook/assets/image%20%2891%29.png)



