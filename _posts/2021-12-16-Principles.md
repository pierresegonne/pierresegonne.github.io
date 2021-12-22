---
layout: post
title: Practices for real world data science
comments: True
share: True
---

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center;">
    <img src="../../resources/posts/2021-12-16/principles_header.jpeg" style="width: 45%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;">Strange attractor goes wow.</span>
</div>

[Last updated: December 16, 2021]

As I write this introduction, I have now been working as a data scientist for [electricityMap](https://www.electricitymap.org/) for about 8 months. Overall, I am responsible, together with the other data scientist in the team, of delivering high data quality at the end of the entire data processing pipeline. Briefly said, electricityMap's data is generated by first aggregating varied data points from numerous public data sources about electricity; and then validating and standardising them before eventually running them through our flow-tracing algorithm for the generation of world-wide real-time hourly electricity consumption figures.

This data is at the core of our vision; to become the single source of truth of electricity carbon data, which we believe is fundamental for our overall mission; to drive the decarbonisation of electrical grids world-wide. This global ambition implies firstly that must be able to overcome at any moment data sources becoming erroneous or unavailable and secondly that we must come up with clever ways to generate truthful data for regions of the world where the aforementioned public electrical data sources are unavailable. This brings about my other current responsibilities; develop and maintain a wide range of models to capture the dynamics of electrical production per factor and exchanges in vastly different areas of the world, and have enough domain expertise to ensure that they behave according to what is physically possible.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center;">
    <img src="../../resources/posts/2021-12-16/emap_team.JPG" style="width: 45%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;">(PS: yes, thank you Nick!)</span>
</div>

These responsabilities are far reaching and evolve rapidly as electricityMap scales up. Impossible to be highly specialised when only 11 (10 bright + me) people are fighting for something that is way too big for them only. The good news is that as electricityMap grows up, I am constantly able to redefine my role as a data scientist, and what practices I should adopt to be succesful. Recently, we opened up a position (link) to recruit someone to become the most knowledgeable about our data quality, and I started delivering on tasks whose scope overflowed in the real of data engineering. The former event, because it will most likely reduce the scope of my responsabilities, pushed me to redefine what I, as a data scientist, should focus my efforts on, and the later revealed to me the necessity of defining and implementing good practices for successfully delivering on that newly defined scope.





Sections:

1. The data scientist role
2. Practices
  -  Invest in tooling
  - Create your toolbox with domain level classes
  - Balancing the trade-off between execution and performance
  - Test first, then debug


Thanks for reading!