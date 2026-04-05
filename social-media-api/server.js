const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const formatResponse = require('./middleware/formatResponse');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const followerRoutes = require('./routes/followers');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(formatResponse);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/docs.html');
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/followers', followerRoutes);

app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

const basePort = config.port;
const host = config.host;
const maxFallback = config.portFallbackMax;

function startOnPort(port, attemptsLeft) {
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const next = port + 1;
      console.warn(`Port ${port} is already in use — trying ${next}…`);
      server.close();
      startOnPort(next, attemptsLeft - 1);
      return;
    }
    console.error(err);
    process.exit(1);
  });

  server.listen(port, host, () => {
    // Step 10 (Practical): expected console output
    console.log(`Social media API listening on port ${port}`);
    console.log(`http://localhost:${port}/`);
    if (port !== basePort) {
      console.log(
        `Note: PORT ${basePort} was in use; using ${port}. Set PORT in .env or close the other process.`
      );
    }
  });
}

startOnPort(basePort, maxFallback);
