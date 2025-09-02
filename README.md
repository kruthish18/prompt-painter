Prompt Painter
==============

Prompt Painter is a simple yet powerful demo application built with **Next.js** and **Tailwind CSS** that integrates the **Runware API** to generate images and videos from custom prompts.

This project was developed as part of the **Runware Developer Evangelist Practical Assessment** to demonstrate how easy it is for developers to build creative media applications using Runware's inference-as-a-service platform.

* * * * *

Overview
--------

Prompt Painter allows developers and creators to:

-   Generate anime-style avatars from text prompts.

-   Customize the output by selecting different **art styles** (Ghibli, Cyberpunk, Retro 90s, etc.).

-   Produce both **image outputs** and **short videos** directly from the Runware API.

-   Experiment with different aspect ratios for creative flexibility.

The project is designed as a **minimal but functional showcase** for presenting at a developer meetup or workshop, highlighting both the **ease of integration** and the **capabilities of Runware's API**.

* * * * *

Tech Stack
----------

-   Next.js -- React-based framework for the frontend

-   Tailwind CSS v4 -- Styling and custom theme configuration

-   [Runware API](https://runware.ai.com) -- Image and video generation backend

-   TypeScript -- Static typing for maintainability

* * * * *

Getting Started
---------------

### 1\. Clone the repository

`git clone https://github.com/kruthish18/prompt-painter.git
cd prompt-painter`

### 2\. Install dependencies

`npm install`

### 3\. Configure environment variables

Create a `.env.local` file in the root directory and add your Runware API key:

`RUNWARE_API_KEY=your_api_key_here`

### 4\. Run the development server

`npm run dev`

Open <http://localhost:3000> in your browser.

* * * * *

Features
--------

-   **Anime Avatar Generation** -- Create images in styles like Studio Ghibli, Shonen, Cyberpunk, Retro 90s, and more.

-   **Video Generation** -- Extend prompts into short animated video sequences.

-   **Customizable Ratios** -- Choose different aspect ratios for images and videos.

-   **Interactive UI** -- Simple form with dropdowns for style selection and text-based prompts.

-   **Built for Developers** -- Code is structured for clarity, showing how to integrate the Runware API with minimal setup.

* * * * *

Project Structure
-----------------


```bash
prompt-painter/
├── components/
│   └── PromptForm.tsx    # Main form UI for inputs
├── pages/
│   ├── index.tsx         # Landing page with generation form
│   ├── _app.tsx          # App wrapper
│   └── api/              # API route handlers
├── styles/
│   └── globals.css
├── tailwind.config.js
├── postcss.config.js
└── next.config.ts
```


* * * * *

Demo
----

A short video walkthrough is provided alongside this repository, showing:

- How the application is structured
- How the Runware API is integrated
- The process of generating images and videos from prompts

**Part 1 – Backend + API Integration**  
[Watch Part 1 Demo](https://www.loom.com/share/6af89ab492354360a22e501393d7980f?sid=48d16ed1-6bce-4887-ad71-bb71fe9b8d3e)

**Part 2 – Frontend Walkthrough**  
[Watch Part 2 Demo](https://www.loom.com/share/a9dc9a9131ff43ffa50871c14d491e12?sid=01da2a8f-f311-4105-9f75-931342ed12d2)

**Live Demo – Hosted on Vercel**  
[Prompt Painter (Vercel Deployment)](https://prompt-painter.vercel.app)

* * * * *

Technical Decisions
-------------------

-   **Next.js + Tailwind CSS** were chosen to quickly build a frontend demo that feels modern and responsive.

-   **Runware API** handles all media inference, removing the need for local GPU compute.

-   The project emphasizes **clarity and simplicity**, suitable for developer education and live demos.

* * * * *

Contributing
------------

This is a demo project created for assessment purposes, but contributions, feedback, or ideas for extensions are welcome.