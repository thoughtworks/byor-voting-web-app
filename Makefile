SHELL:=/bin/bash
.DEFAULT_GOAL:=help

##@ Building

.PHONY: install build

install: ## Pulls and builds the necessary docker image and then runs npm install from within the container `byor-app`
		@/bin/bash .make/ci/install.sh

build:  ## Builds the app for production use
		@/bin/bash .make/ci/build.sh

##@ CI

.PHONY: lint unit_tests ci_all

lint: ## Runs lint checks on TS files
		@/bin/bash .make/ci/lint.sh

unit_tests: ## Runs unit tests
		@export test_script="test"; /bin/bash .make/ci/tests.sh

ci_all: ## Runs all the following tasks in sequence: install, lint, unit tests, build
		@/bin/bash .make/ci/all.sh

##@ CD

.PHONY: deploy semantic_release

deploy: ## Deploys on AWS S3
		@/bin/bash .make/cd/deploy_aws.sh

semantic_release: ## Updates version based on commit messages, commits release notes and pushes release tags
		@/bin/bash .make/cd/semantic_release.sh

##@ Development

.PHONY: check_for_secrets execute_command dev_server_start dev_server_stop dev_clean_up

check_for_secrets: ## Scan local project files looking for dangerous secrets (this is also run as pre-commit hook)
		@/bin/bash .make/development/check_for_secrets.sh

execute_command: ## Executes an arbitrary command inside the application's container
		@/bin/bash .make/development/execute_command.sh

dev_server_start: ## Starts the local dev server
		@/bin/bash .make/development/start.sh

dev_server_stop: ## Stops the local dev server
		@/bin/bash .make/development/stop.sh

dev_clean_up: ## Cleans up the local application and its persistent data
		@/bin/bash .make/development/cleanup.sh

##@ Helpers

.PHONY: help

help:  ## Display this help
		@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
