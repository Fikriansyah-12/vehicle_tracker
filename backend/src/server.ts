import app from './app';
import { createServer } from 'http';
import { connectDB } from './utils/database';

const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

const server = createServer(app);

server.listen(PORT, () => {
  (`🚀 Server running on port ${PORT}`);
  (`📊 Environment: ${process.env.NODE_ENV}`);
  (`🔗 Health check: http://localhost:${PORT}/health`);
  (`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

export default server;