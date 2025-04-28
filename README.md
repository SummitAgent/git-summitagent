cat > README.md << 'EOF'
# git-summitagent
Summit agent with the GitHub MCP server and tools

## Setup and Run

### Prerequisites
- Python 3.9 or higher
- Docker
- GitHub Personal Access Token

### Installation with UV

1. Install uv package manager (if not already installed):
   ```
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Create and activate a virtual environment:
   ```
   uv venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```
   uv pip install -r requirements.txt
   ```

### Running the GitHub MCP Server

1. Create a GitHub Personal Access Token at: https://github.com/settings/personal-access-tokens/new

2. Add your token to the .env file:
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

3. Run the GitHub MCP server:
   ```
   ./run-mcp-server.sh
   ```

You can also run the Docker container directly: