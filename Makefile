IMAGE_REPO=softplan/tenkai-web
TAG=$(TRAVIS_BRANCH)

.DEFAULT_GOAL := build
.PHONY: build container-image pre-build tag-image publish

#Build the binary
build: pre-build
	@echo "Building tenkai"
	yarn install
	yarn build

#Pre-build checks
pre-build:
	@echo "Checking system information"
	node --version
	npm --version

#Build the binary
lint:
	@echo "Lint Code"
	yarn lint

#Build the image
container-image:
	@echo "Building docker image"
	@docker build -t $(IMAGE_REPO) -f Dockerfile --no-cache .
	@echo "Docker image build successfully"

#Tag images
tag-image:
	@echo 'Tagging docker image'
	@docker tag $(IMAGE_REPO) $(IMAGE_REPO):$(TAG)

#Docker push image
publish:
	@echo "Pushing docker image to repository"
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	@docker push $(IMAGE_REPO):$(TAG)
