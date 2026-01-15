#!/usr/bin/env node

/**
 * Custom Next.js server with graceful shutdown
 * Prevents "Controller is already closed" errors on Ctrl+C
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let server;

app.prepare().then(() => {
  server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  // Store original stderr write
  const originalStderrWrite = process.stderr.write;
  let isShuttingDown = false;

  // Graceful shutdown handlers
  const shutdown = (signal) => {
    isShuttingDown = true;
    console.log(`\n${signal} received, shutting down gracefully...`);

    // Filter stderr to hide Next.js shutdown errors
    process.stderr.write = function(chunk, encoding, callback) {
      const str = chunk.toString();
      // Suppress Next.js controller errors during shutdown
      if (str.includes('ERR_INVALID_STATE') ||
          str.includes('Controller is already closed')) {
        if (typeof callback === 'function') callback();
        return true;
      }
      return originalStderrWrite.apply(process.stderr, arguments);
    };

    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 5 seconds
    setTimeout(() => {
      console.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    // Always suppress Next.js shutdown errors
    if (err.code === 'ERR_INVALID_STATE' ||
        err.message?.includes('Controller is already closed') ||
        err.message?.includes('Invalid state')) {
      return; // Silently ignore
    }
    // Only log non-shutdown errors
    if (!isShuttingDown) {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    // Suppress Next.js shutdown promise rejections
    if (reason && typeof reason === 'object') {
      const err = reason;
      if (err.code === 'ERR_INVALID_STATE' ||
          err.message?.includes('Controller is already closed') ||
          err.message?.includes('Invalid state')) {
        return; // Silently ignore
      }
    }
    // Only log non-shutdown errors
    if (!isShuttingDown) {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    }
  });
});
