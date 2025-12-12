# Code Gatekeeper

### Submission for the ElevenLabs Worldwide Hackathon: https://hackathon.elevenlabs.io/

Code Gatekeeper is a conversational AI platform designed to restore
depth, comprehension, and critical thinking to software development in
an era of rapidly accelerating AI assistance.

Since the launch of ChatGPT in November 2022, developers have gained
unprecedented productivity. Yet this shift introduced what we refer to
as the **AI Paradox**: as AI systems generate more code, the average
developer's understanding of that code often decreases. This mirrors
concerns raised in *The Social Dilemma* and *The Great Hack*, which
highlight how powerful technologies can reshape human behaviour,
attention, and autonomy faster than society adapts.

Code Gatekeeper was built to directly confront this emerging problem.

------------------------------------------------------------------------

## Purpose

Modern AI tools can generate thousands of lines of code in seconds, but
comprehension and accountability remain fundamentally human
responsibilities. Code Gatekeeper enforces understanding, not just
output---helping developers preserve essential skills such as reasoning,
interrogation, and critical thinking before approving AI-generated code.

This project embodies OpenAI's call for AI systems that augment, rather
than erode, human abilities.

------------------------------------------------------------------------

## Core Functionality

The working prototype includes two operational ElevenLabs conversational
agents:

### 1. Voice Quiz Agent

A "gatekeeper" that verbally interrogates developers before allowing
code approval.
It asks targeted questions about: - Logic and underlying reasoning
- Edge cases and risk factors
- Implementation details and design decisions

### 2. Voice Tutor Agent

A personalized voice-based instructor that delivers short, focused
explanations of code concepts.
It adapts its teaching to: - The submitted code
- The developer's level
- The specific topic requested

------------------------------------------------------------------------

## Technical Architecture

-   **ElevenLabs Conversational AI**: Real-time voice-to-voice
    interaction with dynamic prompt injection
-   **Claude (Anthropic)**: Code analysis, question generation, and
    adaptive instructional content
-   **OpenAI**: Concept grounding and rationale-preserving prompt
    structure
-   **Lovable**: Rapid frontend scaffolding
-   **Clerk**: Authentication and secure user identity
-   **React + TypeScript**: Stable, type-safe interface
-   **Dynamic Prompt Engineering**: Runtime context assembly for nuanced
    agent behaviour

------------------------------------------------------------------------

## Why This Matters

Code Gatekeeper addresses a growing real-world challenge: large
organizations incur significant technical debt when teams approve code
they do not fully understand. Industry estimates place this burden at
over **\$50 billion annually**.

Use cases include: - Engineering teams requiring structured review
- Universities and bootcamps teaching programming
- Enterprises conducting compliance or audit-driven assessments
- AI-augmented developers maintaining long-term competence

------------------------------------------------------------------------

## Alignment with the Hackathon Theme

The ElevenLabs Worldwide Hackathon challenges participants to build
systems that authentically converse---systems that listen, reason, and
respond.

Code Gatekeeper transforms code generation into an interactive,
comprehension‑driven process. It reframes conversational agents as
protectors of understanding rather than mere assistants.

It is not only a tool that talks back.
It is a tool that ensures developers can talk back, too.
