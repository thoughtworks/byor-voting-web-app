# Contributing to byor-voting-web-app

First of all, thanks for taking the time to contribute to the project!

The following is a set of guidelines, not rules, for contributing. Feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[Support from the community](#support-from-the-community)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
-   [BYOR](#byor)
-   [BYOR-VotingApp](#BYOR-VotingApp)
-   [Github Repositories](#github-repositories)

[How Can I Contribute?](#how-can-i-contribute)
-   [Reporting Security Bugs](#reporting-security-bugs)
-   [Reporting Bugs](#reporting-bugs)
-   [Suggesting Enhancements](#suggesting-enhancements)
-   [Pull Requests](#pull-requests)

[Guidelines](#guidelines)
-   [Git Commit Checks](#git-commit-checks)
-   [Release versioning](#release-versioning)
-   [Typescript Styleguide](#typescript-styleguide)
-   [Testing](#testing)
-   [Build the application for Production](#build-the-application-for-production)
-   [Build the docker image](#build-the-docker-image)

[HOWTOs](#howtos)
-   [Running the application locally in watch mode](#running-the-application-locally-in-watch-mode)
-   [Manage application's container](#manage-applications-container)
-   [Running the application from production-grade docker image](#running-the-application-from-production-grade-docker-image)

[Credits](#credits)

## Code of Conduct

This project and everyone participating in it is governed by the [Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Support from the community

You can find out more about how to get in touch with the community in [SUPPORT.md](SUPPORT.md)

## What should I know before I get started?
The BYOR-VotingApp is a companion app to [build-your-own-radar](https://github.com/thoughtworks/build-your-own-radar) project (aka BYOR).

### BYOR
Is a library that generates an interactive radar, inspired by [ThoughtWorks Technology Radar](http://thoughtworks.com/radar/). 

The radar creation exercise invites you to have a conversation across all organizational levels and review your entire technology portfolio. This enables you to:
- Objectively assess what's working, and what it isn't
- Pollinate innovation across teams and experiment accordingly
- Balance the risk in your technology portfolio
- Work out what kind of technology organization you want to be
- Set a path for future success


You can generate the radar:
- running locally the BYOR project
- submitting your blips in Google Sheet or csv format to the [BUILD YOUR OWN RADAR](https://radar.thoughtworks.com) page
- running the [BYOR-VotingApp](#BYOR-VotingApp), collecting blips and generating the radar on the fly

### BYOR-VotingApp
The BYOR-VotingApp helps you to collect blips and to enable conversations during the radar creation exercise.

The BYOR-VotingApp is a SPA (single page application) built with Angular 7 that interacts with a nodejs backend. Data is saved in a MongoDB database.

You can use your MongoDb provider of choice or provision it through the scripts provided in the infrastructure project.

### Github repositories

There is a github respository for the [front-end](https://github.com/thoughtworks/byor-voting-web-app), one for the [back-end](https://github.com/thoughtworks/byor-voting-server), plus one for setting up the necessary [infrastructure](https://github.com/thoughtworks/byor-voting-infrastructure) on Kubernetes or AWS lambda.

## How Can I Contribute?

### Reporting Security Bugs

Security bugs should not be reported as issues. You can find out more about how to report them correctly in [SECURITY.md](SECURITY.md)

### Reporting Bugs

When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](.github/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

- **Determine [which repository the problem should be reported in](#github-repositories)**.
- **Perform a search in [issues](https://github.com/thoughtworks/byor-voting-web-app/issues)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#github-repositories) your bug is related to, create an issue on that repository and provide the following information by filling in [the template](bug_report.md):
- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Don't just say what you did, but explain how you did it**.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Did the problem start happening recently** (e.g. after updating to a new version) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version?** What's the most recent version in which the problem doesn't happen?
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.


### Suggesting Enhancements

When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](.github/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Determine [which repository the enhancement should be suggested in](#github-repositories).**
* **Perform a search in [issues](https://github.com/thoughtworks/byor-voting-web-app/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#github-repositories) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of the application which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

### Pull Requests

The process described here has several goals:

- Maintain BYOR-VotingApp's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible BYOR-VotingApp
- Enable a sustainable system for BYOR-VotingApp's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](.github/pull_request_template.md)
2. Follow the [guidelines](#guidelines)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.


## Guidelines

### Git Commit Checks

#### Secrets disclosure prevention

A git pre-commit hook is automatically installed in the local repository via [Husky](https://github.com/typicode/husky) configuration.

This pre-commit hook will run before any commit to scan the project files with [Talisman](https://github.com/thoughtworks/talisman), looking for things that seem suspicious, such as authorization tokens and private keys.

In case there is any suspect of being about to commit some secrets, the commit will be aborted and a detailed report of the suspicious contents will be printed out on the console. Please refer to [Talisman offical documentation](https://github.com/thoughtworks/talisman) for more details about secrets disclosure prevention.

#### Git Commit Messages

Commit are handled with a precommit hook that enforces the commit message structure via [Commitizen](http://commitizen.github.io/cz-cli/).

The adopted commit message structure is the [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), also known as [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog).

### Release Versioning

Releases are automated with the [semantic-release](https://semantic-release.gitbook.io/semantic-release/) script that gets executed for any set of commits successfully validated by CI/CD pipelines after a change is pushed to the [master branch](https://github.com/thoughtworks/byor-voting-web-app/tree/master). The semantic-release script takes care of:

- setting the right application version number (based on commits' history and semantic versioning conventions) in package.json and package-lock.json files
- updating the CHANGELOG.md file based on commits' history
- pushing a new tag/release to the GitHub repository

### Typescript Styleguide

Typescript styleguide is defined as a set of lint rules.

You can check if your code conforms to them by running:

```shell
make lint
```

If not executed in CI mode, the above command will prompt the user for trying to automatically fix linting errors.

### Testing

- **Unit tests** are executed via [Karma](https://karma-runner.github.io) by the following command:

```shell
make unit_tests
```

If not executed in CI mode, the above commands will prompt the user for executing tests in watch mode.

- **E2E tests**: *TODO (make unit actual unit, add e2e and move not-unitable tests to e2e)*

### Build the application for Production

To build the app for production use:

```shell
make build
```

If no environment variables named `BACKEND_SERVICE_URL` and `RADAR_SERVICE_URL` exist in the current shell, the above command will interactively ask the user for the backend and radar service URL he/she wants to target.

The build artifacts will be stored in the `dist/` directory.

### Build the docker image

```shell
docker build -t byor-app:latest .
```

## HOWTOs

### Running the application locally in watch mode

#### Prerequisites

- [GNU Bash](https://www.gnu.org/software/bash/)
- [GNU Make](https://www.gnu.org/software/make/)
- [Docker](https://www.docker.com/get-started)

The commands to build, test and deploy the application are managed via `make`, which acts as a facility for executing npm scripts inside a docker container. Execute the following command from the root directory of the project to get the complete list of available make commands:

```shell
    make
```

#### First Run
To use the application you will need a backend running, in local or somewhere elese.

To run the application locally the first time you will need to build it with:

```shell
    make install
```

This may take a few minutes.

#### Running web app in watch mode

To start the local web app in watch mode:

```shell
    make dev_server_start
```

If no environment variable named `BACKEND_SERVICE_URL` is existing in the current shell, the above command will interactively ask the user for the backend service URL he/she wants to target.

To see the application running, navigate to `http://localhost:4200/`.

To stop the local web app:

```shell
make dev_server_stop
```

Clean up the local web app:

```shell
make dev_clean_up
```

### Manage application's container

Any arbitrary command can be executed in the context of the application's container via the following command:

```shell
make execute_command
```

If no environment variable named `command` is defined in the current shell, the above command will prompt the user for the command to be executed.

To avoid interactive command request, run:

```shell
command="echo 'replace this echo with real command'" make execute_command
```

This command can be used to execute Angular CLI commands inside the container, eg:

```shell
command="npm run ng -- generate service HelloWorld" make execute_command
```

### Running the application from production-grade docker image

execute:

```shell
export BACKEND_SERVICE_URL='backend-service-url-here'
export RADAR_SERVICE_URL='radar-service-url-here'
export EXPOSED_APP_PORT='exposed-app-port-here'
docker run -it --rm -p ${EXPOSED_APP_PORT}:80 -e BACKEND_SERVICE_URL -e RADAR_SERVICE_URL byor-app:latest
```

## Credits
This guide has been built leveraging the examples found in [Gitub templates](https://help.github.com/en/articles/about-issue-and-pull-request-templates) and in [Atom repository](https://github.com/atom/atom).