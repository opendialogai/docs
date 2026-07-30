---
title: Datetime Action
---

The Datetime action allows you to create and update timestamp attributes.

:::note
Any new timestamp attributes that you create and/or reference with this action type should be [registered](/core-concepts/contexts-and-attributes/attribute-management#creating-a-new-dynamic-attribute) as Timestamp attributes.
:::

### Video

<figure class="od-embed">
<div class="od-embed-frame">
<iframe src="https://www.loom.com/embed/118848be202d465ab443e13a1ae46c15" title="Embedded video" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</figure>

### Fields

The action can be configured by three fields:

* `attribute_name`: This is a required field, and determines the name of the created timestamp attribute.
* `base`: This is an optional field. If it is provided it should be an attribute reference to another timestamp attribute that you want to use, e.g. `{first_seen}`. If it is not provided it will default to the current time at the time of evaluation.
* `modifier`: This is an optional field. If it is provided it should be a representation of how you would like to update the base, or current, time, e.g. `+1 week`. See below for a [list of further examples](/opendialog-platform/actions/actions-from-library/datetime-action#modifier-examples). If it is not provided the base timestamp will not be amended.

![](~/assets/screenshot-2025-07-11-at-11-59-08.png)

### Usecases

There are three different usecases in which you might want to use this action type:

1. You want to create a timestamp attribute based on the current time, e.g. a `now` attribute.
2. You want to create a timestamp attribute relative to the current time, e.g. a `tomorrow` attribute.
3. You want to create a timestamp attribute based on another timestamp attribute, e.g.a `first_seen_plus_one_week` attribute.

### Modifier examples

The following is a non-exhaustive list of example `modifier` values. Under the hood, OpenDialog relies on these [relative formats](https://www.php.net/manual/en/datetime.formats.php#datetime.formats.relative).

* `+1 day` / `-1 day`: Add or substract a day from the base timestamp.
* `+1 week` / `-1 week`: Add or substract a week from the base timestamp.
* `+1 month` / `-1 month`: Add or substract a month from the base timestamp.
* `+1 year` / `-1 year`: Add or substract a year from the base timestamp.
* `Monday`: The next Monday after the base timestamp.
* `first monday of next month`: The first Monday of the following month relative to the base timestamp.
* `last monday of this month`: The last Monday on the month in the base timestamp.
