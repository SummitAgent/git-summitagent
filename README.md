cat > README.md << EOF
# git-summitagent
Summit agent with the GitHub MCP server and tools

## Setup and Run

### Prerequisites
- Python 3.9 or higher
- Docker
- GitHub Personal Access Token

### Installation with UV

1. Install uv package manager (if not already installed):
   \`\`\`
   curl -LsSf https://astral.sh/uv/install.sh | sh
   \`\`\`

2. Create and activate a virtual environment:
   \`\`\`
   uv venv
   source .venv/bin/activate
   \`\`\`

3. Install dependencies:
   \`\`\`
   uv pip install -r requirements.txt
   \`\`\`

### Running the GitHub MCP Server

1. Create a GitHub Personal Access Token at: https://github.com/settings/personal-access-tokens/new

2. Add your token to the .env file:
   \`\`\`
   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   \`\`\`

3. Run the GitHub MCP server:
   \`\`\`
   ./run-mcp-server.sh
   \`\`\`

You can also run the Docker container directly:
\`\`\`
docker run -i --rm \\
  -e GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here \\
  -e GITHUB_TOOLSETS="all" \\
  ghcr.io/github/github-mcp-server
\`\`\`

## Project Structure

- \`.env\`: Contains environment variables (like your GitHub token)
- \`requirements.txt\`: Python dependencies for the project
- \`run-mcp-server.sh\`: Script to run the GitHub MCP server in Docker
- \`.vscode/mcp.json\`: Configuration for VS Code integration

## Dependencies

The project requires several Python packages listed in \`requirements.txt\`:
- \`requests\`: For HTTP requests
- \`pyyaml\`: For YAML parsing
- \`python-dotenv\`: For loading environment variables from .env files
- Development tools: pytest, black, isort, flake8
- Optional LLM-related packages like langchain

Install them with:
\`\`\`
uv pip install -r requirements.txt
\`\`\`
EOF