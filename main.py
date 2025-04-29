from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerHTTP

server = MCPServerHTTP(url='http://localhost:3001/sse')  
agent = Agent('openai:gpt-4o', mcp_servers=[server])  

async def main():
    async with agent.run_mcp_servers():  
        result = await agent.run('How many days between 2000-01-01 and 2025-03-18?')
    print(result.output)
    #> There are 9,208 days between January 1, 2000, and March 18, 2025.


def main():
    print("Hello from git-summitagent!")


if __name__ == "__main__":
    main()
