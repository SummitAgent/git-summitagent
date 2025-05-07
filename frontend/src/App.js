import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    const newMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_token: token,
          question: question,
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }

      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      setQuestion('');
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarySubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_token: token
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }

      console.log('Summary response:', data);
      
      if (data.summary) {
        setSummary({ type: 'success', content: data.summary });
      } else {
        throw new Error('No summary was generated');
      }
    } catch (error) {
      console.error('Summary error:', error);
      setSummary({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        GitHub Repository Assistant
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          type="password"
          label="GitHub Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </Paper>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Chat Assistant" />
          <Tab label="Executive Summary" />
        </Tabs>

        {activeTab === 0 ? (
          // Chat Assistant Tab
          <>
            <Paper 
              elevation={3} 
              sx={{ 
                height: '400px', 
                p: 2, 
                mb: 3, 
                overflow: 'auto',
                backgroundColor: '#f5f5f5'
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    maxWidth: '80%',
                    mb: 2,
                    ml: msg.type === 'user' ? 'auto' : 0,
                    mr: msg.type === 'bot' ? 'auto' : 0,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: 
                        msg.type === 'user' ? '#1976d2' : 
                        msg.type === 'error' ? '#d32f2f' : '#fff',
                      color: msg.type === 'user' || msg.type === 'error' ? '#fff' : 'inherit',
                    }}
                  >
                    <Typography>{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Ask about your repositories..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={!token || loading}
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!token || !question || loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    Send
                  </Button>
                </Box>
              </form>
            </Paper>
          </>
        ) : (
          // Executive Summary Tab
          <Box sx={{ p: 3 }}>
            <form onSubmit={handleSummarySubmit}>
              <Stack spacing={3}>
                <Typography variant="subtitle1" color="text.secondary">
                  Generate a summary of commits across all repositories accessible with your GitHub token
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!token || loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                  Generate Summary
                </Button>
              </Stack>
            </form>

            {summary && (
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 3,
                  p: 3,
                  backgroundColor: summary.type === 'error' ? '#d32f2f' : '#4caf50',
                  color: '#fff'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Commit Summary
                </Typography>
                <Typography 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  {summary.content}
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
