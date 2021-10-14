---
description: Guide to quickly spin up an OpenDialog app using Docker
---

# Simple Docker-based installation

## Introduction

This guide provides a quick way to set up OpenDialog on your own machine. This is useful to help learn how OpenDialog works and experiment with conversational applications. 

## Step 1 - Install Docker Desktop

OpenDialog does not have a desktop application, so to help us try it out on our own machines without having to deal with complex setup instructions or setup virtual server hosts we make use of Docker. Docker is open-source software that allows us to package up code in a single "container" and deploy it to a variety of different environments, such as our own machine. 

To get started you will need to install Docker Desktop on your own machine. Docker Desktop is an all-in-one easy to install application that will provide all the tools necessary for OpenDialog to work locally without affecting the configuration of your own machine. 

[Follow the instructions from Docker to how to install on either a Windows or a Mac. ](https://docs.docker.com/desktop/)

## Step 2 - Download the latest version of OpenDialog Quick Start

* Visit the [OpenDialog Quick Start repo](https://github.com/opendialogai/quick-start) on Github and download the latest version as a zip file on your local machine. 
* Unzip the file - you will end up with a directory containing the OpenDialog docker-compose quick start. 

## Step 3 - Configure Docker Environment

From within a terminal application navigate to the OpenDialog Quick-Start directory that you just unzipped.

```
cd quick-start
```

We will now tell Docker to use a specific configuration file to create the necessary application environment.

```
docker-compose up -d
```

If this is the first time you are doing this don't be surprised if it takes some time to download all the necessary components. It is setting up a fully-fledged environment on your own machine. 

Once it is done we need to run a command that is going to initialise the OpenDialog application itself. 

```
docker-compose exec app bash docker/scripts/update-docker.sh
```

You can now login to the web application by visiting `http://localhost` and logging in with the user: `admin@example.com` and password: `opendialog`.
