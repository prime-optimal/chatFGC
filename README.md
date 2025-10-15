# chatFGC

A modern chat application built with TanStack Router and custom AI integration, featuring a clean and responsive interface with real-time streaming responses.

**🚀 Live Demo:** [Add your deployment URL here]

## 📋 Overview

chatFGC is a fully-featured chat application that has been migrated from Anthropic Claude to a custom chatbot API. It provides a seamless conversational experience with streaming responses, markdown rendering, and conversation management.

## ✨ Key Features

- **🤖 Custom AI Integration**: Compatible with OpenAI, Anthropic, and other chat APIs
- **📝 Rich Markdown Rendering**: Syntax highlighting and structured content
- **🎯 Customizable System Prompts**: Tailor AI behavior for specific use cases
- **🔄 Real-time Streaming**: Smooth typing animation for responses
- **💬 Conversation Management**: Save, organize, and search chat history
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🔐 Secure API Integration**: Server-side API key management

## 🚀 Quick Start

Get chatFGC running in minutes:

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd chatFGC
   bun install  # or npm install
   ```

2. **Configure your API**
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

3. **Start development**
   ```bash
   bun run dev  # or npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) and start chatting!

## Table of Contents
- [chatFGC](#chatfgc)
  - [📋 Overview](#-overview)
  - [✨ Key Features](#-key-features)
  - [🚀 Quick Start](#-quick-start)
  - [Table of Contents](#table-of-contents)
  - [🚀 Deployment](#-deployment)
    - [Deploy to Netlify](#deploy-to-netlify)
    - [Environment Variables for Production](#environment-variables-for-production)
  - [📝 Migration Notes](#-migration-notes)
    - [What Changed](#what-changed)
    - [API Integration Details](#api-integration-details)
  - [Features](#features)
    - [AI Capabilities](#ai-capabilities)
    - [User Experience](#user-experience)
  - [Architecture](#architecture)
    - [Tech Stack](#tech-stack)
    - [Prerequisites](#prerequisites)
  - [📁 Project Structure](#-project-structure)
    - [Key Directories](#key-directories)
  - [⚙️ Getting Started](#️-getting-started)
    - [Local Setup](#local-setup)
    - [Local Setup with Netlify Dev (Recommended)](#local-setup-with-netlify-dev-recommended)
    - [Troubleshooting](#troubleshooting)
    - [Building For Production](#building-for-production)
  - [🎨 Styling](#-styling)
  - [📊 Error Monitoring](#-error-monitoring)
  - [🔧 Environment Configuration](#-environment-configuration)
    - [Custom Chat API Configuration](#custom-chat-api-configuration)
      - [For Local Development](#for-local-development)
      - [API Configuration Options](#api-configuration-options)
      - [Supported API Formats](#supported-api-formats)
      - [Using Different API Providers](#using-different-api-providers)
    - [Convex Configuration (Optional)](#convex-configuration-optional)
  - [🛣️ Routing](#️-routing)
    - [Adding A Route](#adding-a-route)
    - [Adding Links](#adding-links)
    - [Using A Layout](#using-a-layout)
  - [📥 Data Fetching](#-data-fetching)
  - [💾 State Management](#-state-management)
  - [📚 Documentation](#-documentation)
    - [API Documentation](#api-documentation)
    - [Development Documentation](#development-documentation)
    - [Configuration Files](#configuration-files)
  - [🔄 Changelog](#-changelog)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🔗 Related Resources](#-related-resources)
  - [🆘 Support](#-support)

## 🚀 Deployment

### Deploy to Netlify

Want to deploy immediately? Click this button

[![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=<your-repo-url>)

### Environment Variables for Production

When deploying, make sure to set these environment variables:
- `CHAT_API_URL`: Your chat API endpoint
- `CHAT_API_KEY`: Your API authentication key

## 📝 Migration Notes

chatFGC was migrated from a TanStack Chat template with the following key changes:

### What Changed
- **API Integration**: Migrated from Anthropic Claude to custom chatbot API
- **Branding**: Updated from "TanStack Chat" to "chatFGC"
- **UI Cleanup**: Removed Netlify notifications and debug tools
- **Configuration**: Fixed TanStack Start setup issues

### API Integration Details
The application now uses a custom API with these characteristics:
- **Endpoint**: OpenAI-compatible `/api/v1/chat/completions`
- **Authentication**: Bearer token
- **Streaming**: Server-Sent Events format
- **Request Format**: Standard OpenAI structure with custom extensions

For complete migration details, see the [CHANGELOG.md](CHANGELOG.md).

## Features

### AI Capabilities
- 🤖 Custom AI API integration (compatible with OpenAI, Anthropic, and other chat APIs)
- 📝 Rich markdown formatting with syntax highlighting
- 🎯 Customizable system prompts for tailored AI behavior
- 🔄 Real-time message updates and streaming responses

### User Experience
- 🎨 Modern UI with Tailwind CSS and Lucide icons
- 🔍 Conversation management
- 🔐 API key management
- 📋 Markdown rendering with code highlighting

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with TanStack Start
- **Routing**: TanStack Router
- **State Management**: TanStack Store
- **Database**: Convex (optional)
- **Styling**: Tailwind CSS 4
- **AI Integration**: Custom API (compatible with OpenAI, Anthropic, and other chat APIs)
- **Build Tool**: Vite 6 with Vinxi

### Prerequisites

- [Node.js](https://nodejs.org/) v20.9+
- (optional) [nvm](https://github.com/nvm-sh/nvm) for Node version management
- Custom Chat API endpoint (OpenAI, Anthropic, or compatible API)
- (optional) [Convex Account](https://dashboard.convex.dev/signup) for database storage

## 📁 Project Structure

The project follows a modular structure for better organization and maintainability:

```
chatFGC/
├── CHANGELOG.md         # Detailed changelog of all changes
├── convex/              # Convex database schema and functions (optional)
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── SettingsDialog.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBanner.tsx
│   │   └── WelcomeScreen.tsx
│   ├── docs/            # Documentation files
│   │   └── openapi.json  # API specification
│   ├── routes/          # TanStack Router route definitions
│   │   ├── __root.tsx   # Root layout and configuration
│   │   └── index.tsx    # Main chat interface
│   ├── store/           # TanStack Store state management
│   ├── utils/           # Utility functions and helpers
│   │   └── ai.ts        # Custom API integration
│   ├── api.ts           # API client configuration
│   ├── client.tsx       # Client-side entry point
│   ├── convex.tsx       # Convex client configuration
│   ├── router.tsx       # Router configuration
│   ├── sentry.ts        # Sentry error monitoring setup
│   ├── ssr.tsx          # Server-side rendering setup
│   └── styles.css       # Global styles
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment variables
├── app.config.ts        # TanStack Start application configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.ts    # PostCSS configuration for Tailwind
├── tsconfig.json        # TypeScript configuration
└── vite.config.js       # Vite bundler configuration
```

### Key Directories

- **src/components/**: Contains all reusable UI components used throughout the application
- **src/routes/**: Contains route definitions using TanStack Router's file-based routing
- **src/store/**: Contains state management logic using TanStack Store
- **convex/**: Contains Convex database schema and functions (if using Convex for persistence)

## ⚙️ Getting Started

### Local Setup

Follow these steps to set up and run the project locally:

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatFGC
   ```

2. **Install dependencies**
   ```bash
   bun install  # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your credentials:
   - Required: Add your chat API URL (`CHAT_API_URL`)
   - Required: Add your chat API key (`CHAT_API_KEY`)
   - Optional: Add custom headers for your API (`CHAT_API_HEADERS`)
   - Optional: Add Convex URL if using database features (`VITE_CONVEX_URL`)
   - Optional: Add Sentry credentials for error monitoring (`VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`)

4. **Start the development server**
   ```bash
   bun run dev  # or npm run dev
   ```
   
   The application should now be running at [http://localhost:3000](http://localhost:3000)

### Local Setup with Netlify Dev (Recommended)

You can also use [Netlify Dev](https://www.netlify.com/products/dev/) to run your application locally with Netlify's full functionality:

1. **Install Netlify CLI globally** (if you haven't already)
   ```bash
   npm install -g netlify-cli
   ```

2. **Link your Netlify site** (optional)
   ```bash
   netlify link
   ```
   This will connect your local project to a Netlify site. If you haven't created a Netlify site yet, you can skip this step.

3. **Start the development server with Netlify Dev**
   ```bash
   netlify dev
   ```
   This will:
   - Start your local development server (similar to `npm run dev`)
   - Load your Netlify environment variables
   - Provide local versions of Netlify Functions (if any)
   - Simulate the Netlify production environment locally

4. **Access your site**
   The application will be available at [http://localhost:8888](http://localhost:8888) by default.

### Troubleshooting

- **Node.js version**: Ensure you're using Node.js v20.9 or higher. You can check your version with `node -v`.
  ```bash
  # Using nvm to install and use the correct Node version
  nvm install 20.9
  nvm use 20.9
  ```

- **API Key Issues**: If you encounter errors related to your chat API, verify that your API URL and key are correctly set in the `.env` file and that your API endpoint is accessible.

- **Port Conflicts**: If port 3000 is already in use, the development server will automatically try to use the next available port. Check your terminal output for the correct URL.

- **Convex Setup (Optional)**: If you're using Convex for database functionality:
  ```bash
  npx convex dev
  ```
  This will start the Convex development server alongside your application.

### Building For Production

To build this application for production:

```bash
bun run build  # or npm run build
```

To preview the production build:

```bash
bun run serve  # or npm run serve
```

## 🎨 Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) v4 for styling.

## 📊 Error Monitoring

This project uses [Sentry](https://sentry.io) for error monitoring and performance tracking. Sentry integration is optional and the project will run normally without Sentry configuration.

To set up Sentry:

1. Add your Sentry DSN and Auth Token to your `.env` file (created during the Getting Started steps)

```
# .env file
VITE_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token-here
```

If the Sentry environment variables are not defined, the application will run without error monitoring.

## 🔧 Environment Configuration

**Important**: Never commit your `.env` file to version control as it contains sensitive information. The `.env` file is already included in the project's `.gitignore` file to prevent accidental commits.

### Custom Chat API Configuration

This template is designed to work with any chat API that follows standard OpenAI-compatible formats, including OpenAI, Anthropic, and other providers.

#### For Local Development
```
# .env file
CHAT_API_URL=https://api.openai.com/v1/chat/completions
CHAT_API_KEY=your_api_key_here
```

**Important:** Use `CHAT_API_URL` and `CHAT_API_KEY` (without the `VITE_` prefix) to ensure the API credentials remain server-side only and are not exposed in the client-side bundle.

#### API Configuration Options

- **CHAT_API_URL**: Your chat API endpoint (required)
- **CHAT_API_KEY**: Your API key for authentication (required)
- **CHAT_API_HEADERS**: Additional headers (optional, comma-separated key:value pairs)

Example with custom headers:
```
CHAT_API_HEADERS=Authorization:Bearer token,X-Custom-Header:value
```

#### Supported API Formats

The chatbot is designed to work with various API response formats:

1. **OpenAI-compatible APIs**: Handles `choices[0].delta.content` for streaming
2. **Simple APIs**: Handles direct `content` or `text` fields
3. **Server-Sent Events (SSE)**: Processes streaming data in SSE format
4. **Non-streaming responses**: Automatically converts to streaming format

#### Using Different API Providers

**OpenAI:**
```
CHAT_API_URL=https://api.openai.com/v1/chat/completions
CHAT_API_KEY=sk-your-openai-key
```

**Anthropic:**
```
CHAT_API_URL=https://api.anthropic.com/v1/messages
CHAT_API_KEY=sk-ant-your-anthropic-key
```

**Custom API:**
```
CHAT_API_URL=https://your-custom-api.com/chat
CHAT_API_KEY=your-custom-key
CHAT_API_HEADERS=X-API-Version:v1,X-Custom-Header:value
```

### Convex Configuration (Optional)

For persistent storage of conversations:

1. Create a Convex account at [dashboard.convex.dev](https://dashboard.convex.dev/signup)
2. Create a new project in the Convex dashboard
3. Run `npx convex dev` in your project directory to set up Convex
4. Add your Convex deployment URL to the `.env` file

```
# .env file
VITE_CONVEX_URL=your_convex_deployment_url
```

## 🛣️ Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
    </>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## 📥 Data Fetching

There are multiple ways to fetch data in your application. You can use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

## 💾 State Management

This project uses TanStack Store for local state management. The store files are located in the `src/store` directory. For persistent storage, the project can optionally use Convex as a backend database.

Here's a simple example of how to use TanStack Store:

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

const countStore = new Store(0);

function Counter() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function Counter() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}
```

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

## 📚 Documentation

### API Documentation
- **OpenAPI Specification**: See [`src/docs/openapi.json`](src/docs/openapi.json) for detailed API documentation
- **Custom API Integration**: See [`src/utils/ai.ts`](src/utils/ai.ts) for implementation details

### Development Documentation
- **Component Architecture**: UI components are located in [`src/components/`](src/components/)
- **State Management**: TanStack Store implementation in [`src/store/`](src/store/)
- **Routing Configuration**: TanStack Router setup in [`src/routes/`](src/routes/)

### Configuration Files
- **Application Config**: [`app.config.ts`](app.config.ts) - TanStack Start configuration
- **Build Config**: [`vite.config.js`](vite.config.js) - Vite bundler configuration
- **TypeScript Config**: [`tsconfig.json`](tsconfig.json) - TypeScript compiler options

## 🔄 Changelog

For a detailed history of all changes made during the migration and development, see [CHANGELOG.md](CHANGELOG.md).

## 🤝 Contributing

When contributing to chatFGC:
1. Follow the existing code style and patterns
2. Update documentation for any new features
3. Add entries to the CHANGELOG.md for significant changes
4. Test with the custom API integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Resources

- **TanStack Start**: [Documentation](https://tanstack.com/start)
- **TanStack Router**: [Documentation](https://tanstack.com/router)
- **TanStack Store**: [Documentation](https://tanstack.com/store)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com)
- **React 19**: [Documentation](https://react.dev)

## 🆘 Support

If you encounter issues:
1. Check the [Troubleshooting section](#troubleshooting) in this README
2. Review the [CHANGELOG.md](CHANGELOG.md) for recent changes
3. Verify your API configuration in the `.env` file
4. Check browser console and terminal for error messages
