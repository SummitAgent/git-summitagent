# GitHub Repository Assistant

A web-based chatbot that allows users to ask questions about their GitHub repositories using GitHub's MCP (Machine Coding Protocol) and OpenAI's GPT-4.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js and npm
- Docker Desktop
- A GitHub Personal Access Token
- An OpenAI API Key

## Setup

### 1. Environment Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd git-summitagent
```

2. Create and configure your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your tokens:


### 2. Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Unix/macOS
# or
.\venv\Scripts\activate  # On Windows
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 3. Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

You'll need three terminal windows to run all components:

### Terminal 1: Start the MCP Server

```bash
# From the project root
./run-mcp-server.sh
```

### Terminal 2: Start the Backend Server

```bash
# From the project root
source venv/bin/activate
cd backend
uvicorn app:app --reload --port 8000
```

### Terminal 3: Start the Frontend

```bash
# From the project root
cd frontend
npm start
```

## Using the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your GitHub Personal Access Token in the token field
3. Ask questions about your repositories in the chat interface

## Features

- Real-time chat interface
- Secure token handling
- Integration with GitHub's MCP
- Powered by GPT-4 for intelligent responses
- Material-UI based responsive design

## Architecture

The application consists of three main components:

1. **Frontend**: React application with Material-UI
2. **Backend**: FastAPI server handling requests and AI integration
3. **MCP Server**: GitHub's Machine Coding Protocol server running in Docker

## Troubleshooting

### Common Issues

1. **Docker Issues**
   - Ensure Docker Desktop is running
   - Try pulling the MCP image manually:
     ```bash
     docker pull ghcr.io/github/github-mcp-server
     ```

2. **Token Issues**
   - Verify your GitHub token has the necessary permissions
   - Ensure your OpenAI API key is valid and has sufficient credits

3. **Port Conflicts**
   - Make sure ports 3000, 3001, and 8000 are available
   - Check for any existing processes using these ports

### Error Messages

If you encounter errors:
1. Check if all three components are running
2. Verify your environment variables are set correctly
3. Ensure your virtual environment is activated for backend operations

## Development

To modify the application:

- Frontend code is in `frontend/src/`
- Backend code is in `backend/`
- MCP server configuration is in `run-mcp-server.sh`

## Security Notes

- Never commit your `.env` file
- Keep your API keys secure
- Rotate your tokens periodically
- Use environment variables for sensitive data

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]