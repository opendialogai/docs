# Anatomy of an opening

The specifics of what is included in an opening depends on the context, the mode, the users, the channel and other factors. Much of the academic research on conversational openings comes from telephone conversations, which may or may not fit your use case well. What are the common patterns we see in openings?

**Summons/answer**

Summons (aka trigger)/answer (ring → hello?; knock knock → come in)

This establishes the availability of both parties for a conversation. Completion of SA creates non-terminality, i.e. the interaction is expected to continue. This seems to be what popup chatbots often leverage to create/coerce engagement, i.e. it feels awkward to leave a popup bot hanging so people may be more likely to engage with it (either responding or closing).

**Greetings**

A: Hello

B: Hello

**Identification/recognition**

Caller ID or other ways of already knowing who’s there can modify this.

* Name sharing, name request, name giving, name correction
* Establish footing, roles for each participant
* Organizational affiliation (“I’m Tom, your Lowe’s bot”)

**Welfare check**

How-are-you sequences. These can vary substantially across cultures.

**News check**

What’s new?

**Authentication**

(“What is your account number?”); many designs include this as a required part of an opening sequence, but it is a worse experience to require a user to authenticate when their reason for being there doesn’t actually need authentication. As a result, the authentication process will be treated as its own pattern (see below). – separated into a distinct OpenDialog pattern

These patterns are informed by human-human conversational patterns, however some might not be directly transferable to bot-human conversations. It therefore makes sense to take a user-centered approach and handle these patterns should a user invoke them. The app, however, likely should not invoke them on its own (unless contextually relevant).
