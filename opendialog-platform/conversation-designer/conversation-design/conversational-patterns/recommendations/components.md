# Components

This conversational input/output process can be repeated such that the input becomes richer and the output recommendations change (hopefully getting better). In general, if you are presenting recommendations conversationally (in voice or text), you will want to either choose one to present or somehow summarise a set of options. You could show one at a time and if the user says no you move on to the next. But, if you have the option of presenting multiple options in a carousel or in a linked page, more options can be presented at once.

If your bot is able to get subtle user sentiment in response to recommendations, that sentiment could also be fed into the recommender system to guide future recommendations.

### Output: Present a recommendation (or multiple)

* Optional: explain why that recommendation was presented, e.g. “a bestseller”, a “new release”. Explaining “can increase the system’s perceived transparency, user trust and satisfaction, and they can help users make faster and better decisions” ([Gedikli](https://www.sciencedirect.com/science/article/abs/pii/S1071581913002024)).
* Ask if the user likes it&#x20;
  * if yes, ask if they’d like to buy or see more like it
  * if no, propose different options or ask for preferences
  * assess user sentiment of the response, then go down yes or no path (or something else)
* Show possible critiques (too colorful, too small, reject, “on track”) that a user can use to respond that refine future recommendations.

### Input: Preference collection (see Collecting Information pattern)

* System driven: ask user preference questions (shoe size, gender, running style) → when complete, **present recommendations**
* User (then system) driven: Ask user to state their own preferences or ask their own question (“I’d like some size 10 running shoes for women”, “do you have size 10 running shoes for women?”) → use system-driven slot filling to complete required categories → when complete, **present recommendations**
* Optional: external knowledge of items. You can filter with preferences from user profile or other sources, though you’ll want to be careful with how this is used since users may buy for someone other than themselves.
