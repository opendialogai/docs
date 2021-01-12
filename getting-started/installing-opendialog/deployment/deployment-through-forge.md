---
description: >-
  How to spin up and serve an OpenDialog application using Laravel Forge with
  easy code deployment to the server.
---

# Deployment through Forge

## Introduction

This guide describes how to spin up and serve an OpenDialog application using [Forge](https://forge.laravel.com/). 

This is primarily useful for development and testing purposes or for applications with modest resource needs. It is not suitable for large-scale production applications as it installs all resources \(including the Dgraph server\) on a single VM.

## Before Starting

Before getting started you will need the following:

1. At least a hobby-level account with [Forge](https://forge.laravel.com/) as you will need to create a new server from scratch. This guide assumes that the only application running on the server is OpenDialog. 
2. An account with [DigitalOcean](https://www.digitalocean.com/) - the instructions here are easily translatable to other environments such as AWS or Linode, but we are assuming Digital Ocean.    
3. A Git repository with your OpenDialog application - this is the respository that you will be connecting to Forge and that will then be pulled into your server. The instructions below will assume a [GitHub](https://github.com/) repository but any appropriate online Git provider will do.  
4. A domain through which to host your application. We will be pointing an A record of this domain to our Digital Ocean droplet and using Forge to provide SSL certificates. 

### Step 1: Create a Recipe on Forge to prep the service post-provision

Login to Forge and create a simple recipe that will apply the necessary changes following the standard provision from Forge. 

Click on Recipes - add a recipe called OpenDialog Server Preparation, with the user being root and add the following:

```text
apt update
apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt update
apt-cache policy docker-ce
apt install docker-ce -y
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
usermod -aG docker forge
```

Here is a screenshot of how the configuration should look. We will be using this later on when setting up our server.

![Forge Recipe to prep an OD service](../../../.gitbook/assets/image%20%2829%29.png)

### Step 2: Create a new server

The next step is to prepare the server itself. We are assuming that Forge is configured with your credentials to be able to launch servers on Digital Ocean. Please [check out their documentation](https://forge.laravel.com/docs/1.0/servers/providers.html) if that is not the case.  

We will setup the simplest possible server - be sure to select the Post-Provision Recipe that we prepared in Step 1. With all the settings in place, you can click on "Create Server".

![](../../../.gitbook/assets/image%20%2845%29.png)

If there are no issues with the Digital Ocean access and the options select the server will start building and we need to wait for it to be provisioned.

### Step 3: Create a new site on the server

Forge will create a default site setup on the server, but for the sake of complete clarity, we will create a new site. 

![](../../../.gitbook/assets/image%20%2818%29.png)

Once the new site is created we can delete the `default` site. 

If you are using a URL make sure that there is a DNS A record pointing to the IP address of your server.

### Step 4: Connect the new site to an OpenDialog repository

We can now connect an OpenDialog application repository to this site and then we can proceed to set it up. 

* Clone the [OpenDialog Application](https://github.com/opendialogai/opendialog) from Github \(or grab the [latest release](https://github.com/opendialogai/opendialog/releases) of the source code\) and set it up on your own repository.
* In Forge go to your just created site and select Git Repository, set up the SSH key provided by Forge in your OpenDialog repository to enable Forge to pull from the repo. 
* Add the repository details and the branch to use in the "Install Repository" form on Forge and click on Install Repository. 

![](../../../.gitbook/assets/image%20%2838%29.png)

If all goes well it know means that you can deploy code to your newly minted Forge-managed server. Just a few more steps and we will be ready to use our OpenDialog application. 

### Step 5: Deployment Script & Environment variables

We need to update the deployment script to ensure that it does the appropriate tasks for an OpenDialog deployment. Replace everything from line 8 downwards of the default Deploy script of Forge with the following:

```text
if [ -f artisan ]; then
    php artisan package:discover
    php artisan migrate --force
    php artisan vendor:publish --tag=dgraph --force
    php artisan vendor:publish --tag=public --force
    php artisan vendor:publish --tag=scripts --force
fi

yarn install -f
yarn run dev

cd dgraph
docker-compose down
docker-compose up -d
```

In addition, we need to set the environment variables to the correct values. Forge allows us to manage the `.env` file of Laravel applications directly the the admin panel. Click on Environment. 

* Set the `APP_URL` to the URL of your site. 
* Update the `DB_DATABASE` and `DA_USERNAME` variables to match your settings. If in doubt, go back to your Server settings and look under databases.  
* Set `DGRAPH_URL` should be set to `127.0.0.1`

At this point initiate another deployment, by clicking on Deploy Now, so that you get Dgraph up and running. 

### Step 6: Activate SSL 

We will be using Let's Encrypt through Forge for SSL so it is a case of click on SSL through the Forge admin and asking for a Let's Encrypt certificate to be installed. A number of other options are available as well. 

_If you are using a new domain you might want to wait a bit to ensure that the DNS A record change has propagated through - you can use a service such as_ [_DNS Propagation_](https://dnspropagation.net/) _to check the status_

### Step 7: Setup OpenDialog Application on the server

Next step is to log into the server using `ssh` and setup the OpenDialog application itself. If in doubt about how to `ssh` into the server check out the [Forge](https://forge.laravel.com/docs/1.0/accounts/ssh.html) documentation. 

Once you are logged in you need to run the following commands. 

`cd test.opendialog.app` - replace `test.opendialog.app` with your own sitename. 

`php artisan migrate` - setup the database tables

`php artisan user:create` - create a user so you can log in to the application

`php artisan webchat:setup` - setup the webchat configuration settings

`php artisan schema:init` - setup the Dgraph schema

`php artisan specification:import` - import conversations, messages and intents. 

### Step 8: Login to OpenDialog

Visit the OpenDialog application on your URL and log in using the username and password you created. On the Conversations page ensure that you activate the imported conversations and then you should be able to see the webchat widget through the Test Bot page. 

### Step 9: Develop your Bot!

That is it - you have a server running OpenDialog and can easily push updated to your bot. Now you can start developing your own bespoke conversational experience. 



