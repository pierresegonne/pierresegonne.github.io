---
layout: post
title: An engine to predict the future state of electricity grids, worldwide
comments: True
share: True
---

# The big picture

You might not have realised yet in your daily life, but electrification at the global scale is ramping up at a staggering pace. In 2024, it's expected that sales of EVs will represent more than half the vehicles sold in China [1][2]. At the same time, the world is increasingly powered by low-carbon electricity sources. The growth of solar (23%) and wind (10%) electricity generation in 2023 far outpaces that of fossil fuels (0.8%) [3]. In 2023, wind power became the second most prominent source of electricity in the whole of Europe, overtaking fossil gas [4].

Promises of electrified transporation, heating, and industry might have sounded like a far fetched promise, with timelines constantly pushed back, but their realisation is actually right around the corner.

Already, charging point operators are controlling enough charging capacity to match the power output of a large nuclear power plant [5]. This marks a new paradigm for the electricity grid, as consumers are now necessary to be involved in the grid management, and must become positive actors in its decarbonisation.

That's why at Electricity Maps, we foresee a world where billions of grid-connected systems optimise when and where they consume electricity in order to reduce their cost and carbon.

> A dunkelflaute approaches Northern Europe..

In the early morning of the 11th of December 2024, the winds quieted down in Northern Europe. Winds, so common in that part of the world in the midst of winter, were so calm that most wind turbines in the Northern and Baltic seas stopped producing. At the same time, the skies were shrouded with deep clouds, depriving the lands of solar irradation, at a time when luminosity is already at its yearly low. This resulted in a situation coined as a "dunkelflaute" where grids with high renewable penetration must scrape all of their resources to meet the load. While dunkelflautes are not uncommon, it's rare that they last for an extended period of time. In December 2024, the grid tension lasted for more than two days, highlighted the need for reliable multi-days forecasts of the power grids.

Imagine indeed that you're an EV owner with a flexible pricing electricity contract. Having your charging service operator warn you that such grid stress are expected for the next three days, which will lead to skyrocketting electricity prices (On December 12th at 17:00, day-ahead prices reached 873 €/MWh due to the dunkelflaute, their highest level since the energy crisis that followed the invasion of Ukraine) will enable you to plan around this disruption and save significant amounts of money for charging your car.

This is exactly what the new Electricity Maps forecasts enable - by providing a comprehensive prediction for the future state of grids, worldwide, across multiple days (72 hours).

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/NL_production_wind.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> TODO superimpose prices on the plot?.</span>
</div>


# A forecasting engine to power smarter consumption

Electricity Maps has been providing forecasts for the power breakdown, as well as the carbon intensity of certain selected electricity grids since 2017. However, as use cases relying on our forecasts grew in number and reach [6][7], so did our need for a highly scalable and future-proof forecasting engine.

We knew what direction to follow. [Flowtracing](https://www.electricitymaps.com/blog/flow-tracing) allows to trace back the origin of electricity, and is applied to all our historical and real-time data. It is a cornerstone of our offering, as it allows our power mix and carbon data to be aware of the [critical flows of electricity between regions](https://www.electricitymaps.com/blog/consumption-carbon-intensity). We thus knew that if we could start flowtracing forecasted grid states, we would be able to construct a future vision of electricity grids that respects two key principles; consistency with the rest of our offering, and interpretability.

And that's exactly what we did, and what is now at the heart of Electricity Maps' forecasting engine. __Under the hood, combinations of thousands of machine learning models are constantly interweaving previously learned parameters with extensive sets of features to predict all the components of electricity grids worldwide__.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/forecasting_grid.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> Forecasting the whole grid, simplified representation for the US west coast.</span>
</div>

To illustrate what we mean by this, we can have a simplified look at what happens on the west coast of the contiguous United States. A myriad of balancing authorities (black circles) are linked through interconnections (black edges between circles). Within each balancing authority (which correspond to a [zone in our definitions](https://github.com/electricitymaps/electricitymaps-contrib/wiki/What-is-a-zone), ex: [US-CAL-CISO](https://app.electricitymaps.com/zone/US-CAL-CISO/24h?utm_source=website&utm_medium=internal-referral&utm_campaign=forecasts-release)), we operate a set of models that each predict a specific power mode (shown illustratively with solar and nuclear above). In-between each balancing authority, we also model the net flow of electricity being exchanged.

That means that every time we generate a new set of forecasts, __we are effectively modelling how each component (power modes, exchanges, prices etc) of all grids will evolve in the next seventy two hours__.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/flowtracing.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> Forecasting the whole grid, simplified representation for the US west coast.</span>
</div>

Eventually, we reconcile all these individual forecasts by feeding them to our flowtracing algorithm. Our solar model in CISO tells us that tomorrow at 11:00 the production will reach _X_ MW; our nuclear model reliably predicts that the production should remain a constant baseload of _Y_ MW; while our net flow model for the interconnection with the Western Area Power Administration - Desert Southwest ([US-SW-WALC](https://app.electricitymaps.com/zone/US-SW-WALC/24h?utm_source=website&utm_medium=internal-referral&utm_campaign=forecasts-release)) tells us that _Z_ MW of the peak solar production will be exported out of California. Flowtracing aggregates all of these inputs to build a physically coherent configuration of all interconnected grids. __It thus allows Electricity Maps to predict the future origin of electricity, globally__.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/API_CTA.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
</div>

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/coverage.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> Our current forecasts coverage.</span>
</div>

# Building the engine

Orchestrating the execution of thousands of interconnected models is no easy feat and we'd like to highlight here some of the key elements, that, compounded, allowed our grid forecasts team to succesfully deliver a complete global offering. The human race built most nobly when limitations were the greatest, wrote Frank Lloyd Wright [8]. In our case, constraints were numerous; we cannot assume that both our features and targets are ever complete, nor devoid of outliers; we have to automate all operations within our models lifecyle as we're too small a team to rely on manual operations; our models are all interconnected through flowtracing, creating a potential for intractable combinations of individual forecasts ; we are operating under ambitious time constraints as we're at a scale where the opportunity costs are too great to bear. We therefore had to focus on equipping our engine only with the absolute essential and most valuable components, and releasing them as soon as possible to the world for immediate feedback. Under these conditions, the following principles guided us to deliver on our ambition.

## Defining the right metrics and tracking them at scale

Knowing that it's impossible to evaluate progress if you don't have a clear goalpost is obvious, defining the right target is not, especially for a system with thousands of outputs. Luckily for us, we realised the value of clear performance metrics early on in our journey. A customer of ours supported our development of power production forecasts for renewables in the US with clear performance targets. They were set on obtaining solar forecasts with less than 19% of relative error, and wind forecasts with less than 35% of relative error (_we call here relative error the weighted average of normalised mean absolute error across all US zones_).

Having this clear target gave us focus, and when focus is given to talented engineers, [great things happen](https://www.linkedin.com/feed/update/urn:li:activity:7222147972086571008). In a few months, we delivered models with the expected performance, and sought out to define target metrics to guide us for the rest of the way.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/SLAs.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> Our metrics.</span>
</div>

Knowing our targets was only solving one part of the puzzle, as we also needed to surface the required metrics from our systems. Our initial approach, building analytics queries on top of our operational database was short lived. This attempt was plagued with performance issues and had the potential to negatively affect the level of service we were offering. This approach was violating two keys principles; separation of concerns and scalability. We therefore quickly realised that we needed a more robust solution.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/analytics_setup.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> Our analytics setup.</span>
</div>

Thankfully, the BigQuery suite revealed easy to integrate, and provided all the necessary tools to build a future-proof analytics engine. Our forecasts are streamed to BigQuery, and Dataform is used to orchestrate a collection of queries that generate all the necessary metrics.

## Automating ourselves out of the engine

Removing manual operations meant automating the training, testing, deployment and releases of our models.
Due to flowtracing, the output of the individual models are interwoven to determine the origin of electricity in the future. As a direct consequence, changing the preprocessor for the model predicting geothermal power production on the West coast of the US could have an impact on the forecasted coal power consumption in the state of New York. In practice, it means that if we want to guarantee to our users access to a certain release of our forecasts, we need to ensure that no model, nor any of its components change under the hood.

To enable this, while keeping our model parameters fresh, we had to create a set of environments under which the configuration of all the models are set in stone. The only allowed changes under an environment are model parameters.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/environments.png" style="width: 30%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> release.</span>
</div>

Our _nightly_ environment is generally not exposed to end users and allow us to quickly iterate with new models, preprocessors, trainers and feature generators. This environment allows us to test new ideas in a production-like setting. Recently trained models will be tested by a service that will verify if an inference run generates complete forecasts, compare the performance of the model against the previous version, how much the features have changed and so on. If a newly trained model passes all tests, it will be pushed to our _nightly_ environment.

Our _latest_ environment serves the most up to date version of our forecasts. It is expected that it will serve the most accurate forecasts as it will always include the latest production-ready configuration of model components.

Our _support_ environment holds the previous release of our forecasts. It allows users to have access to a stable version in case some changes deployed under _latest_ do not perform as expected.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/major.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> release.</span>
</div>

These environment are fully managed by a service. When we want to trigger an environment update, we can execute a major release, which will promote all model configurations from _nightly_ to _latest_ and from _latest_ to _support_ within a version controlled system.
On a schedule, that service also retrains the model configurations within all environments to ensure freshness of model parameters. We call that a minor release.

## Monitoring thousands of models at once

At Electricity Maps, we've historically been using Grafana as our main tool for observability. While it's a great tool to monitor health of APIs or low-level systems (among others), our initial attemps to directly use it to monitor our new forecasting engine were not successful. A naive approach led us to quickly exceed the maximum cardinality of metrics that can be supported. We further realised that the way Grafana samples metrics makes it unsuitable for any long term monitoring.

Investigations quickly taught us that by focusing on the metrics that are strictly useful for alerting purposes, as well as proper parametrisation of those metrics, we could set a solid foundation for a monitoring system that can keep track of the health of thousands of models spanning three different environment at all times.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/grafana_monitoring.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> grafana monitoring setup.</span>
</div>

Such a system ensures that all desired metrics are scraped in a timely manner by Grafana. Its dashboarding capabilities then provides a direct way to monitor the health of the system, as well as to trigger alerts. The migration to the new forecasting engine did not happen without a few mishaps; we broke our inference pipeline; flowtracing for forecasts ran into the void; our models stopped generating any forecasts and so on. Implementing early in our journey this setup allowed us to be notified in a good time to fix the underlying issues without too much impact on our users.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/grafana_dashboard.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> grafana dashboard.</span>
</div>

Retrospectively, we can claim that our monitoring system has allowed us to go to bed without feeling concerned about things breaking without us realising. It has also notified us of potential incidents in due time, giving us breathing space to turn every incident into an opportunity to improve our system.

## Seeking a single, general purpose model

The dimensionality of the predictions we make is large: we have many signals, across many zones, for many horizons. This means that whenever possible, we avoid hand-crafting models for a particular zone, signal or horizon, as it hinders our scalability.

Instead we prefer to iterate on a single general purpose model that is able to cope with the diversity of feature availability and robustness and that can handle many error modes.

<div id="html" markdown="0" style="display: flex; flex-direction: column; align-items: center; margin: 16px 0 32px;">
    <img src="../../resources/posts/2024-12-18/general_model.png" style="width: 100%; overflow: hidden; margin: 16px 0;">
    <span style="color: #666; font-size: 13px; font-style: italic;"><b>Figure X:</b> general model.</span>
</div>

Depending on the type of forecasts we want to generate, we have to rely on different sets of features. For example, features describing weather patterns are essential to forecast the solar power production, while features engineered to provide useful information about the expected future make-up of the power grid are relevant to forecast net flows between regions.
Having a single model, matched with a combination of preprocessor, trainer, and feature generator (out of multiple possible ones), bundled into a unified module allows us to reach the scalability we need. By smartly interfacing all the components of these modules, we can further ensure that the engine will be future-proof. Whenever an ML Engineer implements a better performing preprocessor, they can safely and smoothly deploy it while maintaining compatibility with the rest of the system, bringing improvements to the thousands of models running.

## Cracking the case - Lithuania

Example case - predicting the future carbon intensity in Lithuania (contrast with some other. easier zone?)

* LT->PL
* LT->SE-SE4
* production, gas

interconnected mechanisms



# Sources

* [1] https://www.reuters.com/business/autos-transportation/chinas-nov-car-sales-rise-fastest-since-january-subsidised-trade-ins-gain-steam-2024-12-09/#:~:text=For%20the%20first%2011%20months,the%20world's%20largest%20auto%20market.
* [2] https://roadgenius.com/cars/ev/statistics/china/
* [3] https://ember-energy.org/
* [4] https://energy.ec.europa.eu/publications/state-energy-union-report-2024_en
* [5] TBD - check with Jesper from Monta
* [6] https://monta.com/en/blog/smartcharging-better/
* [7] https://blog.google/inside-google/infrastructure/data-centers-work-harder-sun-shines-wind-blows/
* [8] Frank Lloyd Wright Collected Writings: 1931-1939 (ed. Rizzoli Intl Pubns, 1992)
