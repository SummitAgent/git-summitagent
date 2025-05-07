from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime
import aiohttp
import json

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    github_token: str

class SummaryRequest(BaseModel):
    github_token: str

async def get_user_repos(token):
    async with aiohttp.ClientSession() as session:
        headers = {"Authorization": f"token {token}"}
        async with session.get("https://api.github.com/user/repos", headers=headers) as response:
            if response.status != 200:
                raise HTTPException(status_code=response.status, detail="Failed to fetch repositories")
            return await response.json()

async def get_repo_commits(token, repo_full_name):
    async with aiohttp.ClientSession() as session:
        headers = {"Authorization": f"token {token}"}
        commits = []
        page = 1
        while True:
            url = f"https://api.github.com/repos/{repo_full_name}/commits?page={page}&per_page=100"
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    print(f"Error fetching commits for {repo_full_name}: {response.status}")
                    break
                page_commits = await response.json()
                if not page_commits:
                    break
                commits.extend(page_commits)
                page += 1
        return commits

@app.post("/api/chat")
async def chat_with_repo(request: ChatRequest):
    try:
        if not request.github_token:
            raise HTTPException(status_code=400, detail="GitHub token is required")

        # Set up the MCP server with Docker
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
                'GITHUB_PERSONAL_ACCESS_TOKEN': request.github_token
            }
        )

        # Initialize the agent
        agent = Agent(model='openai:gpt-4.1', mcp_servers=[server])

        # Create a new event loop for this request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        async def process_request():
            async with agent.run_mcp_servers():
                result = await agent.run(request.question)
                return result.output

        # Run the request in the new loop
        response = await process_request()
        
        return {"response": response}

    except Exception as e:
        print(f"Detailed error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summary")
async def generate_summary(request: SummaryRequest):
    try:
        if not request.github_token:
            raise HTTPException(status_code=400, detail="GitHub token is required")

        print("Fetching repositories and commits...")

        # Get all repositories
        repos = await get_user_repos(request.github_token)
        
        # Get commits for each repository
        all_commits = []
        repo_commits = {}
        contributor_commits = {}
        
        for repo in repos:
            repo_name = repo['full_name']
            print(f"Fetching commits for {repo_name}...")
            commits = await get_repo_commits(request.github_token, repo_name)
            all_commits.extend(commits)
            repo_commits[repo_name] = len(commits)
            
            # Count commits by contributor
            for commit in commits:
                if 'author' in commit and commit['author']:
                    author = commit['author']['login']
                    contributor_commits[author] = contributor_commits.get(author, 0) + 1

        # Sort repositories by commit count
        sorted_repos = sorted(repo_commits.items(), key=lambda x: x[1], reverse=True)
        top_repos = sorted_repos[:3]

        # Sort contributors by commit count
        sorted_contributors = sorted(contributor_commits.items(), key=lambda x: x[1], reverse=True)
        top_contributors = sorted_contributors[:3]

        # Generate summary
        summary = f"""Commit Summary:

Total Commits: {len(all_commits)}

Top 3 Most Active Repositories:
{chr(10).join(f"- {repo}: {count} commits" for repo, count in top_repos)}

Top 3 Most Active Contributors:
{chr(10).join(f"- {contributor}: {count} commits" for contributor, count in top_contributors)}

Recent Activity:
- Latest commit: {all_commits[0]['commit']['message'] if all_commits else 'No commits found'}
- Total repositories with commits: {len(repo_commits)}
- Total contributors: {len(contributor_commits)}"""

        return {"summary": summary}

    except Exception as e:
        print(f"Detailed error in generate_summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)