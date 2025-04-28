# git-summitagent
Summit agent with the GitHub MCP server and tools

## Setup and Run

1. Install uv package manager (if not already installed):
   ```
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Activate the virtual environment:
   ```
   source .venv/bin/activate
   ```

3. Create a GitHub Personal Access Token at: https://github.com/settings/personal-access-tokens/new

4. Add your token to the .env file:
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

5. Run the GitHub MCP server:
   ```
   ./run-mcp-server.sh
   ```

## VS Code Integration

The project is configured for VS Code integration through the .vscode/mcp.json file.
When using VS Code with agent mode, it will prompt for your GitHub token.
