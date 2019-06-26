# Admin Guide
In this guide we will see how to login into the administration panel to manage voting sessions and check the generated radar.

## Table of contents
* [Before starting](#before-starting)
* [Login into the administration panel](#login-into-the-administration-panel)
* [Manage voting events](#manage-voting-events)
    * [Create a new event](#create-a-new-event)
    * [Open and close events to users votes](#open-and-close-events-to-users-votes)
    * [Check voters](#check-voters)
    * [Generate an event tech radar](#generate-an-event-tech-radar)
        * [ThoughtWorks blips](#thoughtworks-blips)
    * [Generate an event word cloud](#generate-an-event-word-cloud)

## Before starting
Before starting be sure to have an instance of the web app and the backend running. Refer to the [README](/README.md) file for more information on how to set it up.

**In this guide we assume that you are running a local instance of the web app**, hence the URLs are all referring to localhost.
If that's not the case please simply replace localhost with your domain of choice.

## Login into the administration panel
To login into the administration panel you can proceed in two ways:

1. Navigate to [http://localhost:4200/admin](http://localhost:4200/admin)
2. Navigate to [http://localhost:4200](http://localhost:4200) and click on the version number in the right bottom corner as highlighted in the following image:

<p align="center">
    <img src="/docs/images/go_to_admin_login.png" width="70%">
</p>

You should be prompted with a login form where you need to insert the administration credentials. The default credentials are:

* **User:** abc
* **Password:** 123

<p align="center">
    <img src="/docs/images/admin_login_form.png" width="70%">
</p>

If credentials are valid you will see the administration panel.

## Manage voting events
In this section we will see how to create and manage the details of your voting events.

### Create a new event
To create a new event simply follow these steps:

1. Click on the **Name** input under the **New event** section
2. Insert the event name
3. Click on **Create** button

The event will be created and you should see a confirmation message.

The new event name will also be visibile from the dropdown list in the **Single event** section.

### Open and close events to users votes
When a new event is created it will still be not open to accept votes from users. This means that when a user open the web application, will not be able to select the event and express votes on it.

To open an event to users votes you just need to:

1. Select the name of the event that you want to open from the dropdown list in the **Single event** section
2. A few buttons will appear. Click on **Open Event**

![BYOR-VotingApp](/docs/images/open_event.png)

The event will be opened and some control buttons will appear along with a confirmation message like in the following image:

![BYOR-VotingApp](/docs/images/opened_event.png)

If you want to close you will just need to click on the **Close Event** button. An event can be opened and closed multiple times without any consequences on the votes.

### Check voters
To have a list of all the voters first and last name for a given event, follow these steps:

1. Select an event name from the dropdown list in the **Single event** section
2. If the event is open you will see a **Voters** button. Click on it
3. You will see a page with the list of voters first and last name

At the top of the page you will also have a **And the winner is...** button that allows you to randomly select a voter from the list in case you are running some kind of contest during the event. :smile:

### Generate an event tech radar
To generate the tech radar based on the votes of a specific event, follow these steps:

1. Select an event name from the dropdown list in the **Single event** section
2. If the event is open you will see a **Tech radar** button. Click on it
3. A new page will be open, showing the ThoughtWorks tech radar based on users votes during the event

<p align="center">
    <img src="/docs/images/generated_tech_radar.png" width="70%">
</p>

It's also possible to generate a tech radar based on the votes generated through all the events opened so far by simply clicking on the **Tech radar** button in the **All events** section of the page.

### ThoughtWorks blips
In the generated tech radar, along with the blips resulting from votes collected during the event, you will also be able to see the official ThoughtWorks ratings for all those blips that matches the ones in the official tech radar

<p align="center">
    <img src="/docs/images/tw_blips.gif" width="70%">
</p>

### Generate an event word cloud
It's possible to generate a word cloud based on the votes of a specific event following these steps:

1. Select an event name from the dropdown list in the **Single event** section
2. If the event is open you will see a **Word cloud** button. Click on it
3. A new page will be open, showing the word cloud based on users votes during the event

<p align="center">
    <img src="/docs/images/generated_word_cloud.png" width="70%">
</p>

Blips names will have a different color based on their quadrant and a different size based on the number of times they were voted.

It's also possible to generate a word cloud based on the votes generated through all the events opened so far by simply clicking on the **Word cloud** button in the **All events** section of the page.