import os
import asyncio
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio

# Retrieve the GitHub token from environment variables
token = os.getenv('GITHUB_PERSONAL_ACCESS_TOKEN')
if not token:
    raise ValueError("GITHUB_PERSONAL_ACCESS_TOKEN is not set in environment variables.")

# Set up the MCP server
server = MCPServerStdio(
    command='docker',
    args=[
        'run',
        '-i',
        '--rm',
        '-e',
        'GITHUB_PERSONAL_ACCESS_TOKEN',
        'ghcr.io/github/github-mcp-server',
    ],
    env={
        'GITHUB_PERSONAL_ACCESS_TOKEN': token
    }
)

# Initialize the agent with the MCP server
agent = Agent(model='openai:gpt-4o', mcp_servers=[server])

# Define the main asynchronous function
async def main():
    async with agent.run_mcp_servers():
        # List available tools
        # tools = await agent.list_tools()
        # print("Available tools:", tools)

        # Run a sample query
        result = await agent.run('How many repositories do I have?')
        print(result.output)

# Execute the main function
if __name__ == '__main__':
    asyncio.run(main())