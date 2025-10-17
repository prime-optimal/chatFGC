# Changelog

All notable changes to chatFGC will be documented in this file.

## [2025-10-17] - Failed package upgrade
- Got cute and tried to update the Tanstack dependencies and ended ruining the whole thing.  
- Site wouldn't load, Droid spent an hour trying to fix it to no avail.  
- Ended up rebasing from the Github repo. 

## [2025-10-16] - Deployment to Netlify
- Good news: Successfully deployed.  Bad news: Forgot to include API key so it needed to be re-deployed.

## [2025-10-15] - Initial Migration & Customization

### 🚀 **Major Changes**
- **Complete API Migration**: Migrated from Anthropic Claude to custom chatbot API
- **Branding Update**: Changed application name from "TanStack Chat" to "chatFGC"
- **Configuration Overhaul**: Fixed TanStack Start configuration issues

### 🐛 **Bug Fixes**
- **Fixed TanStack Configuration**: Resolved "tanstackStart is not defined" error
  - Removed incorrect plugin usage from `vite.config.js`
  - Properly configured TanStack Start to use `app.config.ts` as main configuration
- **Environment Variable Issues**: Fixed API endpoint configuration

### 🔄 **API Integration**
- **Removed Anthropic Dependencies**: 
  - Removed `@anthropic-ai/sdk` from `package.json`
  - Updated environment variable configuration
- **Custom API Implementation**:
  - Implemented full OpenAI-compatible API integration
  - Added support for streaming responses via Server-Sent Events
  - Configured for specific endpoint: `https://qoxbcgubs4duu2cuvbscfpgt.agents.do-ai.run/api/v1/chat/completions`
  - Added Bearer token authentication
  - Implemented comprehensive error handling
- **Request/Response Format**:
  - Streaming: Handles `choices[0].delta.content` format
  - Non-streaming: Handles `choices[0].message.content` format
  - Custom parameters: `instruction_override`, `stream_options`, etc.

### 🎨 **UI/UX Changes**
- **Removed Netlify AI Gateway Banner**: Eliminated top notification about Netlify AI Gateway
- **Removed TanStack Router Devtools**: Removed debug button from bottom-left corner
- **Branding Updates**:
  - Updated welcome screen heading to "chatFGC"
  - Updated page title to "chatFGC"
  - Maintained gradient styling and visual consistency

### 📁 **File Changes**

#### Modified Files:
- `vite.config.js` - Fixed configuration, removed incorrect plugins
- `src/utils/ai.ts` - Complete rewrite for custom API integration
- `package.json` - Removed Anthropic dependencies
- `.env.example` - Updated environment variable documentation
- `.env` - Updated with custom API endpoint
- `src/routes/index.tsx` - Removed TopBanner import and usage
- `src/routes/__root.tsx` - Removed devtools, updated page title
- `src/components/WelcomeScreen.tsx` - Updated branding to "chatFGC"
- `README.md` - Updated documentation for custom API

#### Added Files:
- `src/docs/openapi.json` - API specification documentation

#### Files No Longer Used:
- `src/components/TopBanner.tsx` - Removed Netlify notification component

### ⚙️ **Configuration Updates**

#### Environment Variables:
- **Removed**: `ANTHROPIC_API_KEY`
- **Added**: 
  - `CHAT_API_URL` - Custom API endpoint URL
  - `CHAT_API_KEY` - API authentication key
  - `CHAT_API_HEADERS` - Optional custom headers

#### API Configuration:
- **Endpoint**: `/api/v1/chat/completions`
- **Authentication**: Bearer token
- **Streaming**: Enabled by default
- **Request Format**: OpenAI-compatible with custom extensions

### 🔧 **Technical Improvements**
- **Error Handling**: Comprehensive error handling for authentication, rate limiting, and network issues
- **Streaming Support**: Full streaming response support with smooth typing animation
- **API Flexibility**: Supports multiple API response formats with fallbacks
- **Security**: Server-side only API key storage (no client exposure)

### 📚 **Documentation**
- Updated README.md with custom API configuration instructions
- Added examples for different API providers (OpenAI, Anthropic, custom)
- Documented environment variables and setup process
- Added API integration troubleshooting guide

### 🧪 **Testing & Validation**
- Verified development server startup without errors
- Confirmed API integration attempts (awaiting API key for full testing)
- Validated UI changes and branding updates
- Tested configuration loading and environment variable handling

---

## Migration Notes

### For Developers
1. **API Key Required**: Add `CHAT_API_KEY` to `.env` file for functionality
2. **Endpoint Configuration**: Update `CHAT_API_URL` if using different API endpoint
3. **Custom Headers**: Use `CHAT_API_HEADERS` for additional authentication or headers

### For Users
1. **New Branding**: Application is now called "chatFGC"
2. **Cleaner Interface**: Removed notifications and debug tools for better user experience
3. **Same Features**: All original chat functionality preserved with new API backend

### API Integration
The application now uses a custom chatbot API with the following characteristics:
- OpenAI-compatible request/response format
- Streaming support for real-time responses
- Custom parameters for enhanced functionality
- Comprehensive error handling and user feedback

---

## Future Enhancements
- [ ] Add API health check endpoint
- [ ] Implement retry logic for failed requests
- [ ] Add conversation export/import functionality
- [ ] Enhance error messages with user-friendly guidance
- [ ] Add API response time monitoring