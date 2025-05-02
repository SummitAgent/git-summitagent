import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    </Container>
  );
}

export default App;
