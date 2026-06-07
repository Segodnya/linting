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
	pnpm install --frozen-lockfile

# Build all packages into their dist/
build:
	pnpm build

# Run tsup in watch mode
dev:
	pnpm dev

# Remove build artifacts
clean:
	rm -rf packages/*/dist packages/*/coverage .turbo

# Run ESLint across the repo
lint:
	pnpm lint

# Run ESLint with --fix
fix:
	pnpm lint:fix

# Detect unused files, dependencies, and exports
knip:
	pnpm knip

# Type-check with tsc --noEmit
typecheck:
	pnpm typecheck

# Run unit tests
test:
	pnpm test

# Run unit tests with V8 coverage on custom rules
coverage:
	pnpm test:coverage

# Full CI gate: lint + knip + typecheck + build + coverage (enforces threshold)
verify: lint knip typecheck build coverage

# Run Prettier across the repository
format:
	pnpm format
