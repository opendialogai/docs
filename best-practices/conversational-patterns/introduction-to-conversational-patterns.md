# Introduction to conversational patterns

### **Who it is for**

This library is for anyone working to make automated conversations, whether they call themselves a “conversation designer” or something else. In addition, anyone in the halo of the conversation design process (product managers, marketers, engineers) can benefit from understanding the patterning described below.

### **How It Is Structured**

This library contains a set of conversational patterns to help you when building a conversational experience. Some of these are standard across all types of conversational interactions, e.g. openings, closings, and repair. Others are more useful in certain use cases or domains, e.g. information collection, providing recommendations, handling transfers, and user authentication. The goal of this document is to provide an overview of these common patterns, some examples, and templates that you can use yourself.

Before listing patterns, it is useful to describe a taxonomy of pattern types. These types will help you know what patterns you are dealing with, and how they relate to each other. Drawing inspiration from (2018, [Moore and Arar](https://www.morganclaypoolpublishers.com/catalog\_Orig/product\_info.php?products\_id=1414), p77), some conversational patterns are about saying things and others are about managing the interaction. Each of these patterns can then have their own subtypes. This library is not an exhaustive list of all patterns.

#### _**Saying things**_

_Conversational activities_, i.e. saying things, are about what can get done in a conversation. A simple example is a question-answer sequence, where either the bot or the user asks a question, and the other answers. These question-answer pairs can be in long sequences as well, which in aggregate become larger genres like quizzes or user information collection.

If thought about more generally, the question-answer pair involves an initiation (question) and a response (answer). There are other ways of initiating than with a question, e.g. with a request, a suggestion, an instruction, among others. Each initiation can then be followed by the other’s response, e.g. a granting of a request:

`A: Please turn off the lights.`

`B: Sure thing <<turns off lights>>`

While initiation-response pairs involve a lot of back and forth, another common conversational activity involves one participant speaking for an extended period, e.g. storytelling. In storytelling, the patterns change, such that the speaker holds the floor for a while. The listener gives backchannels to encourage continuing (or doesn’t and interrupts the story). At some point, the story ends and the conversation moves on to the next thing. This extended telling could be useful not just for storytelling but for any extended turn, e.g. giving an educational training talk, doing a how-to explanation, or leading a guided meditation.

#### _**Managing the interaction**_

In everyday talk between humans, much of the time spent conversing is spent managing the interaction itself, either the immediate sequence or the conversation as a whole.

A common sequence management pattern is repair, where the participants work to resolve some misunderstanding or misstep. Repair itself can be managed in many ways, but the overarching purpose is to fix some bump in the road. A simple example is when the user doesn’t hear what the bot said and asks it to repeat. Another is when the user doesn’t know what a word or acronym means and asks the bot to explain.

In addition to managing or negotiating sequences within the conversation, the participants also need to manage the conversation as a whole. This includes how the conversation starts (the opening), how it ends (the closing), and meta-discussion about what the bot can do (capabilities). While the conversation’s openings and closings can be more involved, sections of the conversation also have openings and closings. Of particular interest is sequence closing moves that indicate a particular section of the conversation is complete.

#### _**Compositionality: combining patterns**_

Building conversations from patterns instead of from atomic units can help facilitate and motivate more complex designs. The patterns of conversation are powerful also for how they work together to compose larger structures of talk. In fact, conversation design itself is a compositional process.

The concept of _compositionality_ is central to much of linguistics, where one challenge is to explain how a finite number of words can generate an infinite number of sentences. The magic to that generative power is in compositionality, i.e. how the units of language can be combined and recombined in ever-expanding and recursive ways to support limitless possibilities. The subfield of _compositional semantics_, for example, explores how the semantic meaning of a sentence is determined by the parts of the sentence and how they combine together.

“The principle of compositionality is the principle that the meaning of a complex expression is determined by the meanings of its constituent expressions and the rules used to combine them.” (Wikipedia)

The goal of the library is to facilitate the composition process. In addition, composed patterns could themselves be reused, taking the reusability even further. For example, a post-purchase retail module could include patterns like asking for contact info, upselling, and closing. A new conversation design could adopt the whole module, not just the patterns themselves.

### How to Use It

Current state: a conversation designer writes sample dialogues, looks at project requirements, sketches out an initial build. In the process, they are likely to confront some of the same challenges that others have. They may crib portions from previous work they have done, but often the entire experience needs to be built from scratch.

With this pattern library, you can “stand on the shoulders of giants,” taking advantage of the patterns that others have analyzed and documented, and quickly incorporate them into your designs. You may design the overall component structure of the interaction, but can then leverage the patterns to flesh them out. The library is here to help you put meat on those bones.

One way to use this library is for ideas. You can read through the different types of patterns and common subtypes, and then use that in your brainstorming. In this sense, it can operate as an educational resource, and it may be useful to read through all the patterns.

Another way to use it is to go straight to a pattern that is important for you at a particular moment. Perhaps you are designing a welcome sequence and want to know what commonly occurs during a conversation opening. In this case, you could jump straight to the Opening pattern, get ideas for what commonly occurs there, and move forward on that part of your design.

A third way to use this library is as a source of pre-built templates within the OpenDialog ecosystem. As part of explaining the patterns, we show how they could be implemented with OpenDialog. This helps see a demo of that pattern in action. It also means the building process is already complete. Simply clone the template to use it, or dig inside to see how it was done.

#### About this library

The information contained here comes from academic research, books, blog posts and other web information, product documentation, live products, and personal experience. You are getting a distillation of this diversity of sources into meaningful pieces. The goal is to create a pattern language for conversational AI, one that captures central features of conversation, organises it into easy to digest pieces, and facilitates leveraging the patterns for quality conversation design.

What was it like making this document? Much of the academic literature is relevant, but tangentially. The public documentation and blog posts come with insight into the interface, but also motivated by the author’s and company’s needs. This is not an easy project. It’s also not a project that is ever really done in the same way that language and conversation never really stops changing. But within that forest of variability, we hope to have captured the pieces that can guide us.

The idea of a pattern language can be traced back to the architect, design-theorist, and professor at UC Berkeley, Christopher Alexander. In multiple books and essays, Alexander laid out his vision for what ails modern urban design, and how a pattern language could address some of those concerns. Simply, many designed spaces have a top-down sterility to them, because they impose a structure that does not reflect the vitality and energy of lived-in spaces. To capture that realness, Alexander wanted to observer how spaces evolve in living human ecosystems and what systematicity is inherent there. He captured this systematicity in a book named A Pattern Language.

This pattern language approach was later extended to software engineering and object-oriented programming in the book Design Patterns by Gamma et al. The book described common ways that software engineering gets done, collects those into a library of types, and presents them for others’ benefit. More recently, Moore and Arar, in the book Conversational UX Design, move towards doing this within the space of designing conversations with bots. Their proposed framework is inspired largely by the academic literature of the field of Conversation Analysis, and implemented within IBM.

This document elaborates on the mission of these prior efforts, focused on conversational AI, drawn from many sources, and focused on important patterns for the design of conversational experiences. It can help you see more, and achieve more more easily.
