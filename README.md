# RunicRPC Demo App - Solana Wallet Tracker

A production-ready demonstration of the RunicRPC SDK in action. This app showcases real-time Solana wallet tracking with intelligent RPC load balancing, circuit breaking, and comprehensive observability.

## Features

### Core Functionality
- **Real-time wallet balance tracking** - Monitor multiple Solana wallets simultaneously
- **Automatic load balancing** - RunicRPC distributes requests across configured providers
- **Smart caching** - Reduces API calls and improves response times
- **Circuit breaker protection** - Prevents cascading failures when endpoints are unhealthy
- **Live activity feed** - See requests, cache hits, retries, and errors in real-time
- **Endpoint health monitoring** - Track performance and status of each RPC provider

### UI/UX Highlights
- Matches RunicRPC design system (dark theme with cyan accents)
- Responsive layout that works on mobile and desktop
- Interactive wallet cards with copy-to-clipboard and Solscan integration
- Real-time stats dashboard showing performance metrics
- Smooth animations and loading states

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- At least one Solana RPC provider API key (Helius or Alchemy recommended)

### Installation

1. **Navigate to the demo app directory:**
   ```bash
   cd demo-app
   ```

2. **Install dependencies** (if not already done from monorepo root):
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** and add your API keys:
   ```env
   # Required: Add at least one provider
   NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key-here
   NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key-here

   # Optional: QuickNode configuration
   NEXT_PUBLIC_QUICKNODE_HTTP_URL=https://your-endpoint.quiknode.pro/
   NEXT_PUBLIC_QUICKNODE_WS_URL=wss://your-endpoint.quiknode.pro/

   # Optional: RunicRPC settings
   NEXT_PUBLIC_RUNIC_STRATEGY=latency-based
   NEXT_PUBLIC_RUNIC_LOG_LEVEL=info
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

6. **Open your browser:**
   ```
   http://localhost:3001
   ```

## Using RunicRPC CLI & Dashboard

The demo app uses the SDK, but you can also use the CLI and Dashboard packages alongside it for enhanced monitoring and testing.

### Using the CLI Package

The CLI provides operational tools to test and benchmark your RPC setup.

**Install globally:**
```bash
npm install -g @runic-rpc/cli
```

After installation, the `runic-rpc` command is available system-wide.

**Test your providers:**
```bash
# Test connectivity (using environment variables)
runic-rpc test --providers helius,alchemy

# Example output:
# ✓ Helius: 145ms (healthy)
# ✓ Alchemy: 167ms (healthy)
```

**Run benchmarks:**
```bash
# Benchmark specific RPC methods
runic-rpc benchmark --methods getSlot,getBalance --duration 30s

# Example output:
# getSlot: 1,234 req/s, p95: 89ms, errors: 0.1%
# getBalance: 987 req/s, p95: 112ms, errors: 0.2%
```

**Monitor in real-time:**
```bash
# Launch interactive monitoring dashboard
runic-rpc monitor --config ./runic.config.json

# Shows:
# - Live RPS per endpoint
# - Latency graphs
# - Circuit breaker states
# - Error rates
# Press 'q' to quit
```

**Initialize config file:**
```bash
# Generate a config template
runic-rpc init

# Creates runic.config.json with all options documented
```

### Using the Dashboard Package

The Dashboard provides a web UI to monitor your RunicRPC instance.

**Install globally:**
```bash
npm install -g @runic-rpc/dashboard
```

**Launch the dashboard:**
```bash
# Start on default port (3000)
runic-rpc-dashboard

# Or specify custom port
runic-rpc-dashboard --port 3002

# Dashboard available at http://localhost:3002
```

**What you'll see:**
- **Overview page**: Total requests, latency, error rates, cache hit rate
- **Endpoints page**: Per-provider health, circuit breaker states, performance metrics
- **Charts**: Request/error trends, latency over time
- **Live updates**: Real-time stats refreshing every 2 seconds

### Running All Three Together

You can run the demo app, CLI monitor, and dashboard simultaneously:

**Terminal 1 - Demo App:**
```bash
cd apps/demo-app
pnpm dev
# → http://localhost:3001
```

**Terminal 2 - Dashboard:**
```bash
runic-rpc-dashboard
# → http://localhost:3000
```

**Terminal 3 - CLI Monitor:**
```bash
cd apps/demo-app
runic-rpc monitor --config ./runic.config.json
# Interactive terminal UI
```

**What this gives you:**
- **Demo app (3001)**: Your custom wallet tracker application
- **Dashboard (3000)**: Official RunicRPC monitoring UI
- **CLI monitor**: Terminal-based real-time stats

All three can share the same configuration via environment variables and `runic.config.json`.

### Creating a Config File for CLI/Dashboard

Create `apps/demo-app/runic.config.json`:

```json
{
  "providers": {
    "helius": {
      "apiKey": "${HELIUS_API_KEY}"
    },
    "alchemy": {
      "apiKey": "${ALCHEMY_API_KEY}"
    }
  },
  "strategy": "latency-based",
  "cache": {
    "enabled": true,
    "ttl": 2000,
    "maxSize": 500
  },
  "retry": {
    "maxAttempts": 3,
    "initialDelay": 100,
    "maxDelay": 2000
  },
  "circuitBreaker": {
    "failureThreshold": 5,
    "timeout": 30000
  },
  "healthCheck": {
    "enabled": true,
    "interval": 30000
  },
  "rateLimit": 100,
  "logLevel": "info"
}
```

The CLI and Dashboard will load this config and use your environment variables.

## Getting API Keys

### Helius (Recommended)
1. Sign up at [helius.dev](https://helius.dev)
2. Create a new project
3. Copy your API key
4. Free tier: 100 requests/second

### Alchemy
1. Sign up at [alchemy.com](https://www.alchemy.com)
2. Create a Solana app
3. Copy your API key
4. Free tier: 300M compute units/month

### QuickNode (Optional)
1. Sign up at [quicknode.com](https://quicknode.com)
2. Create a Solana endpoint
3. Copy both HTTP and WebSocket URLs
4. Free tier: 5M requests/month

## How It Works

### RunicRPC Integration

The app demonstrates key RunicRPC features:

**1. Provider Configuration** ([src/lib/runic.ts](./src/lib/runic.ts))
```typescript
const rpc = new RunicRPC({
  providers: {
    helius: { apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY },
    alchemy: { apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY },
  },
  strategy: 'latency-based',
  cache: { enabled: true, ttl: 2000 },
  retry: { maxAttempts: 3 },
  circuitBreaker: { failureThreshold: 5 },
});
```

**2. Making Requests**
```typescript
// RunicRPC automatically selects the best endpoint
const balance = await rpc.request('getBalance', [publicKey]);
```

**3. Event Monitoring**
```typescript
// Listen to RunicRPC events for observability
rpc.on('cache:hit', () => console.log('Cache hit!'));
rpc.on('request:retry', (event) => console.log('Retrying...'));
rpc.on('circuit:open', (event) => console.log('Circuit breaker opened'));
```

**4. Performance Tracking**
```typescript
// Get comprehensive stats
const stats = rpc.getStats();
// Returns: totalRequests, totalErrors, cacheHitRate, endpoint health, etc.
```

### Architecture

```
demo-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AppShell
│   ├── page.tsx           # Main dashboard
│   ├── activity/          # Activity log page
│   └── settings/          # Settings page
├── src/
│   ├── lib/
│   │   ├── runic.ts       # RunicRPC instance configuration
│   │   └── wallets.ts     # Wallet utilities and demo data
│   └── components/
│       ├── WalletCard.tsx        # Wallet balance display
│       ├── StatsCard.tsx         # Metric card component
│       ├── EndpointStatus.tsx    # RPC endpoint health
│       └── ActivityLog.tsx       # Real-time activity feed
└── .env.local             # Your API keys (not committed)
```

## Demo Wallets

The app tracks these notable Solana wallets:

1. **Jupiter Aggregator** - Jupiter Protocol main program
2. **Bonk DAO Treasury** - Community treasury wallet
3. **USDC Token Mint** - Circle USDC mint authority
4. **Binance Hot Wallet** - Exchange hot wallet

You can modify the wallet list in [src/lib/wallets.ts](./src/lib/wallets.ts).

## Routing Strategies

RunicRPC supports 4 routing strategies (configured via `NEXT_PUBLIC_RUNIC_STRATEGY`):

### 1. Latency-Based (Default - Recommended)
Selects endpoints based on EWMA latency and success rate scoring. Best for production use.

```env
NEXT_PUBLIC_RUNIC_STRATEGY=latency-based
```

### 2. Round-Robin
Simple rotation through healthy endpoints. Predictable but doesn't account for performance.

```env
NEXT_PUBLIC_RUNIC_STRATEGY=round-robin
```

### 3. Weighted
Probability-based selection using configured weights. Useful for custom traffic distribution.

```env
NEXT_PUBLIC_RUNIC_STRATEGY=weighted
```

### 4. Random
Random selection from healthy endpoints. Simple fallback option.

```env
NEXT_PUBLIC_RUNIC_STRATEGY=random
```

## Customization

### Adding Your Own Wallets

Edit [src/lib/wallets.ts](./src/lib/wallets.ts):

```typescript
export const DEMO_WALLETS: WalletData[] = [
  {
    address: 'YourPublicKeyHere...',
    name: 'My Wallet',
    description: 'Personal wallet',
  },
  // ... more wallets
];
```

### Adjusting RunicRPC Settings

Edit [src/lib/runic.ts](./src/lib/runic.ts) to customize:

- **Cache TTL**: `cache: { ttl: 5000 }` (milliseconds)
- **Retry attempts**: `retry: { maxAttempts: 5 }`
- **Circuit breaker threshold**: `circuitBreaker: { failureThreshold: 10 }`
- **Health check interval**: `healthCheck: { interval: 60000 }`
- **Rate limiting**: `rateLimit: 200` (requests per second)

### Changing the Design

The app uses the `@runic-rpc/ui` design system. All colors, components, and styles are defined in the shared UI package.

To customize:
1. Edit `tailwind.config.ts` for theme overrides
2. Components use Tailwind classes matching the design system
3. All icons from `lucide-react` library

## Production Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Environment Variables

Make sure to set these in your production environment:

```env
NEXT_PUBLIC_HELIUS_API_KEY=...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
NEXT_PUBLIC_RUNIC_STRATEGY=latency-based
NEXT_PUBLIC_RUNIC_LOG_LEVEL=warn
```

### Deployment Platforms

This Next.js app works with:
- **Vercel** (recommended - zero config)
- **Netlify** (supports Next.js)
- **AWS Amplify**
- **Docker** (use included Dockerfile if created)

## Troubleshooting

### "Controller is already closed" error on shutdown

**Cause**: Next.js cleanup issue when pressing Ctrl+C (Windows)

**Solution**: This is **harmless and expected** - the server is shutting down correctly. The demo app uses a custom server (`server.js`) that handles graceful shutdowns and suppresses this error.

If you still see it, just ignore it - it's only during shutdown and doesn't affect functionality.

### "No healthy endpoints available"

**Cause**: No API keys configured or all providers are failing

**Solution**:
1. Verify `.env.local` exists and has valid API keys
2. Check that keys are prefixed with `NEXT_PUBLIC_`
3. Restart the dev server after adding keys

### Balance fetching is slow

**Cause**: RunicRPC is trying unhealthy endpoints first

**Solution**:
1. Switch to `latency-based` strategy (default)
2. Wait for health checks to mark slow endpoints unhealthy (30s)
3. Check your provider rate limits aren't exceeded

### Cache hit rate is 0%

**Cause**: Cache is disabled or TTL is too short

**Solution**:
1. Ensure `cache: { enabled: true }` in runic.ts
2. Increase TTL: `cache: { ttl: 5000 }`
3. Make identical requests to trigger cache hits

[Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

## License

MIT - Same as RunicRPC monorepo

---

**Built with RunicRPC** - Ancient reliability for modern Solana infrastructure
