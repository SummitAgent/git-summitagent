#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if GITHUB_PERSONAL_ACCESS_TOKEN is set
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN is not set in .env file"
  echo "Please create a .env file with your GitHub token"
  exit 1
fi

# Run the GitHub MCP server container
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PERSONAL_ACCESS_TOKEN \
  -e GITHUB_TOOLSETS="all" \
  -p 3001:3001 \
  ghcr.io/github/github-mcp-server
