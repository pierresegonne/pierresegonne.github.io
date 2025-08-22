---
layout: post
title: This website is now carbon-aware
comments: True
share: True
date: 2025-08-22
---

During one of Electricity Map's hack-a-volt, my colleague [Ronan](https://ronan-mch.github.io/) developed a plug-and-play integration to make a website carbon aware.

Under the hood what happens is that:

- A Cloudflare Worker queries the [carbon-intensity-level API](https://portal.electricitymaps.com/developer-hub/api/reference#latest-carbon-intensity-level) with the latitude and longitude of the Cloudflare request. That allows to guess the grid zone in which the user is located.
- A frontend library calls this worker and renders a HTML snippet.

From this, we can insert a callback into the provided widget and start controlling what happens on the rendered webpage

```js
caw.render({
      target: "carbon-aware-widget",
      callback: (zone, level) => this.handleCarbonLevel(zone, level),
      showBadge: false
});
```

Based on this callback, and some javascript shenanigans, I was able to make this website carbon aware in about an hour. Note that my front-end development days are far gone, so I guess that a web developper could probably do this much more efficiently.

## This blog reacts to changes in the local carbon intensity of electricity.

You should notice the following badge in the top-left corner.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2025-08-22/carbon_aware_badge.png" style="width: 60%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;">
        Carbon aware badge
    </span>
</div>

There are three level of carbon intensity, which have the following effects on what is rendered:

- **Low**: The full content of the website is shown.
- **Medium**: The website is rendered in black and white, with reduced quality images.
- **High**: Images are completely hidden, as well as the disqus comments under the posts. Everything is rendered in black and white.

A picture is worth a thousand words, so I'd encourage you to test it out directly. Open the console and run the following

opening the browser console and running:

```javascript
// Test high carbon level
window.carbonAwareManager.setCarbonLevel('high');

// Test medium carbon level
window.carbonAwareManager.setCarbonLevel('medium');

// Test low carbon level
window.carbonAwareManager.setCarbonLevel('low');
```

With some test images to demonstrate the functionality:

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2025-08-22/Oda_Krohg_-_Portrait_of_the_Swedish_Painter_Ivar_Arosenius_-_NG.M.00617_-_National_Museum_of_Art,_Architecture_and_Design.jpg" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;">
        Portræt af den svenske maler Ivar Arsenius by Oda Krogh. Credit:
        <a href="https://da.m.wikipedia.org/wiki/Fil:Oda_Krohg_-_Portrait_of_the_Swedish_Painter_Ivar_Arosenius_-_NG.M.00617_-_National_Museum_of_Art,_Architecture_and_Design.jpg" target="_blank" rel="noopener">Wikipedia Commons</a>.
        This image should disappear when the carbon intensity level is high.
    </span>
</div>

## Why make websites carbon-aware?

To quote Fershad Irani, Tom Jarret and Hannah Smith, in their [Branch post about turning websites grid-aware](https://branch.climateaction.tech/issues/issue-9/designing-a-grid-aware-branch/) (note that here we use carbon-aware and grid-aware interchangeably)

> The idea is to holistically consider the electricity grid that digital thing is operating within, and look for opportunities where it can help, rather than harm, that grid.