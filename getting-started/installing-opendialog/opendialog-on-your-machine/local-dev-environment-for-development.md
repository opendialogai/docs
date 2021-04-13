---
description: Description of the local dev environment OD devs use
---

# Local Dev Environment for development

{% hint style="warning" %}
Warning - you are browsing the documentation for an older version of OpenDialog. Please check out the latest version. 
{% endhint %}

## Standard Local Dev Environment

The local dev environment installation is suitable for those that are looking to write code for OpenDialog applications. 

It uses Docker to remove any dependencies for your local environment beyond installing Docker Desktop itself and at the same time and it means you can customise it extensively to your needs and to match your eventual production environment. 

[This Github repository is the best place to get the most updated instructions on how to setup a local dev environment. ](https://github.com/opendialogai/opendialog-dev-environment)

## Working on more complex OpenDialog projects

When working on more complex OpenDialog projects that may have a number of interdependencies to other services that we want to replicate in our local dev environment we clone the default environment dev environment and update the docker-compose.yml configurations and any other related settings to match the project needs. This ensures that all developers can quickly spin up that project in their local environments. 



