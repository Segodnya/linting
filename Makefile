.DEFAULT_GOAL := help
.PHONY: help install build dev clean lint fix knip typecheck test coverage verify format

# Show this help
help:
	@awk ' \
		/^# / { sub(/^# /, "", $$0); desc = $$0; next } \
		/^[a-zA-Z_-]+:/ { if (desc != "") { split($$0, parts, ":"); printf "  \033[36m%-12s\033[0m %s\n", parts[1], desc; desc = "" } } \
		BEGIN { printf "Usage: make <target>\n\nTargets:\n" } \
	' $(MAKEFILE_LIST)

# Install dependencies with a frozen lockfile
install:
	yarn install --frozen-lockfile

# Build the package (tsup + copy assets) into dist/
build:
	yarn build

# Run tsup in watch mode
dev:
	yarn dev

# Remove build artifacts
clean:
	rm -rf dist coverage

# Run ESLint
lint:
	yarn lint

# Run ESLint with --fix
fix:
	yarn lint:fix

# Detect unused files, dependencies, and exports
knip:
	yarn knip

# Type-check with tsc --noEmit
typecheck:
	yarn typecheck

# Run unit tests
test:
	yarn test

# Run unit tests with V8 coverage on custom rules
coverage:
	yarn test:coverage

# Full CI gate: lint + knip + typecheck + build + coverage (enforces threshold)
verify: lint knip typecheck build coverage

# Run Prettier across the repository
format:
	yarn format
