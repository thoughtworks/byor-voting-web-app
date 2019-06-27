# BYOR-VotingApp [web-app]

[![CircleCI](https://circleci.com/gh/thoughtworks/byor-voting-web-app.svg?style=svg)](https://circleci.com/gh/thoughtworks/byor-voting-web-app) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Welcome to the main repository for the **BYOR-VotingApp**!

This repository contains the source code of the **web-app**, if you are looking for information about the **server** component please access [BYOR-VotingApp \[server\]](https://github.com/thoughtworks/byor-voting-server) repository. If you want to explore all the setup and deployment options, take a look at [BYOR-VotingApp \[infrastructure\]](https://github.com/thoughtworks/byor-voting-infrastructure) one.

#### Table Of Contents

[BUILD YOUR OWN RADAR (aka BYOR)](#build-your-own-radar-aka-byor)

[BYOR-VotingApp](#byor-votingapp)
-   [Main features](#main-features)
-   [Running BYOR-VotingApp locally](#running-byor-votingapp-locally)
-   [Running BYOR-VotingApp on Kubernetes or AWS S3](#running-byor-votingapp-on-kubernetes-or-aws-s3)

[Documentation](#documentation)

[How to contribute to the project](#how-to-contribute-to-the-project)

<p align="center">
    <img src="/docs/images/vote_process.gif" width="70%">
</p>

## BUILD YOUR OWN RADAR (aka BYOR)
ThoughtWorks build its own Technology Radar twice a year.
> you can find the latest edition [here](https://www.thoughtworks.com/radar).

We found it so useful that we decided to share the process and build some tools to help every organization run their own radar creation exercise.
> you can find more information about the process and how the tech radar works [here](https://www.thoughtworks.com/radar/byor).

Building your own tech radar, invites you to have a conversation across all organizational levels and review your entire technology portfolio. 

This enables you to:
- Objectively assess what's working, and what isn't
- Pollinate innovation across teams and experiment accordingly
- Balance the risk in your technology portfolio
- Work out what kind of technology organization you want to be
- Set a path for future success

ThoughtWorks encourage you to run the radar twice a year to keep your organisation aware of the fast changing technologies landscape.


## BYOR-VotingApp

### Main features

The BYOR-VotingApp comes preloaded with around 943 technologies to choose among and 1.860 blips evaluated by ThoughtWorks to compare with, extracted from TW TechRadar Vol1 up to Vol20.

If you are planning to use the BYOR creation excercise, the BYOR-VotingApp can help you to:
- [manage one or more BYOR sessions](docs/admin_guide.md#manage-voting-events)
- load a predefined list of technologies to start with, or use the one already preloaded
- let people add a new technology if missing
- [let people vote up to 10 technologies (aka blips)](docs/user_guide.md#vote-for-a-technology)
- let people write comments about blips
- :warning: **[*TODO*]** identify technologies where people disagree on rings and a further decision is needed
- [display the most voted technologies in real-time](docs/admin_guide.md#generate-an-event-word-cloud)
- [display the final tech radar resulting from the votes collected from the participants of the event](docs/admin_guide.md#generate-an-event-tech-radar)
- [show, for matching technologies, the ratings coming from the blips collected alognside with the ones published by ThoughtWorks](docs/admin_guide.md#thoughtworks-blips)

All the Data is stored in a MongoDB database.

### Running BYOR-VotingApp locally

1) install [Docker](https://www.docker.com/get-started)
1) open the terminal
1) clone the project
    ```shell
    git clone https://github.com/thoughtworks/byor-voting-web-app.git
    ```
1) move into the project folder
    ```shell
    cd byor-voting-web-app
    ```
1) startup web app, server, and a local MongoDB
    ```shell
    docker-compose -f docker-compose.all.yml up
    ```
1) access the application front-end on [http://localhost:4201](http://localhost:4201)

> if needed, application back-end is accessible on [http://localhost:3001](http://localhost:3001) and application's mongo database is accessible at `localhost:27019`

> Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for more options on running the web app locally.

> Please refer to [BYOR-VotingApp \[server\]](https://github.com/thoughtworks/byor-voting-server) Github repository for more options on running the server locally and connect to a MongoDB database.

### Running BYOR-VotingApp on Kubernetes or AWS S3

Please refer to [BYOR-VotingApp \[infrastructure\]](https://github.com/thoughtworks/byor-voting-infrastructure) Github repository for installing the application on Kubernetes or AWS S3.

## Documentation

In the docs folder you can find:
-   a [deck](docs/build_your_own_radar-welcome-deck.pdf
) to share or present for explaining what the Tech Radar is and how to rate technologies.
-   the [user guide](docs/user_guide.md)
-   the [admin guide](docs/admin_guide.md)

## How to contribute to the project

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for all the information about how to contribute.
