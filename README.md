# 🚀 Professional Cover Letter Generator

An advanced AI-powered cover letter generator built with Next.js 14, TypeScript, and OpenAI GPT-4. Create compelling, personalized cover letters that stand out to hiring managers and significantly increase your interview rates.

## ✨ Features

### 🎯 **Core Functionality**
- **AI-Powered Generation**: Uses OpenAI GPT-4 for sophisticated, human-like cover letters
- **Unlimited Input**: No character limits on job descriptions or personal achievements
- **Multiple Writing Tones**: Professional, Conversational, Bold, Problem-Solution focused
- **Comprehensive Output**: Generates 800-1200 word cover letters with rich detail

### 🎨 **Enhanced User Experience**
- **Auto-Resizing Text Areas**: Intelligent form fields that grow with your content
- **Real-Time Character Counters**: Track your input without restrictions
- **Smart Animations**: Smooth transitions and visual feedback
- **Copy to Clipboard**: One-click copying with success feedback
- **Export to File**: Download your cover letter as a text file
- **Live Preview**: See changes in real-time with editing capabilities

### 📊 **Advanced Analytics**
- **Keyword Analysis**: Automatic extraction and matching from job descriptions
- **Impact Score**: AI-calculated effectiveness rating (0-100%)
- **Smart Suggestions**: Context-aware improvement recommendations
- **Progress Tracking**: Visual indicators for keyword matching and optimization

### 🔧 **Developer Features**
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Toast Notifications**: Real-time feedback for all user actions
- **Auto-Save**: Persistent storage of work-in-progress
- **Generation History**: Track and restore previous versions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenAI GPT-4 API
- **UI Components**:
  - React Textarea Autosize
  - React Hot Toast
  - Radix UI components
- **State Management**: React hooks with optimized updates
- **Deployment**: Netlify-ready with optimized configuration

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cover-letter-generator-fresh.git
cd cover-letter-generator-fresh
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your OpenAI API key:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key for GPT-4 access | `sk-...` |
| `NODE_ENV` | ❌ | Application environment | `development`, `production` |
| `NEXT_PUBLIC_APP_URL` | ❌ | Application URL for metadata | `https://yourapp.com` |
| `NEXT_PUBLIC_GTM_ID` | ❌ | Google Tag Manager ID for analytics | `GTM-XXXXXXX` |

### 🔐 API Key Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information (GPT-4 requires paid access)
4. Copy the key to your `.env.local` file

**Security Note**: Never commit your `.env.local` file or expose API keys in client-side code.

## 📁 Project Structure

```
cover-letter-generator-fresh/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   └── generate/
│   │       └── route.ts          # Cover letter generation endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── Header.tsx                # Application header
│   ├── InputForm.tsx             # Enhanced input form
│   └── LetterPreview.tsx         # Preview and analytics
├── public/                       # Static assets
├── styles/                       # Global styles
│   └── globals.css               # Tailwind + custom styles
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── netlify.toml                  # Netlify deployment config
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Design System

The application uses a sophisticated dark theme with navy, teal, and soft blue accents:

### Color Palette
- **Primary**: Navy blue (`#1e293b`)
- **Secondary**: Teal (`#0d9488`)
- **Accent**: Soft blue (`#3b82f6`)
- **Background**: Dark slate (`#0f172a`)
- **Foreground**: Light gray (`#f8fafc`)

### Typography
- **Font Family**: Inter (system fallback)
- **Scale**: Responsive typography with fluid scaling
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Prepare for deployment**:
   ```bash
   npm run build
   ```

2. **Connect to Netlify**:
   - Fork this repository to your GitHub account
   - Connect your GitHub account to Netlify
   - Select the forked repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

4. **Environment variables**:
   - Add `OPENAI_API_KEY` in Netlify dashboard
   - Set `NODE_ENV=production`

5. **Custom domain** (optional):
   - Configure your custom domain in Netlify settings
   - SSL certificates are automatically generated

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
```

### Manual Deployment

```bash
# Build the application
npm run build

# Export static files (if using static export)
npm run export

# Deploy the .next or out directory to your hosting provider
```

## 🔧 Configuration

### Customizing the AI Prompts

Edit `app/api/generate/route.ts` to modify:
- **System prompts**: Change the AI's personality and instructions
- **Tone options**: Add new writing styles
- **Output length**: Adjust word count targets
- **Keyword extraction**: Modify industry-specific terms

### Styling Customization

The design system is configured in:
- `tailwind.config.js`: Color scheme and design tokens
- `styles/globals.css`: Custom CSS and Tailwind utilities
- Component files: Inline Tailwind classes

### Adding New Features

The modular architecture makes it easy to extend:
1. **New input fields**: Extend the `InputForm` component
2. **Additional analytics**: Modify the `LetterPreview` component
3. **New API endpoints**: Add routes in `app/api/`
4. **Enhanced UI**: Add components in `components/`

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**:
```
Error: OpenAI API key is not configured
```
- Ensure `.env.local` exists with correct `OPENAI_API_KEY`
- Restart the development server after adding environment variables

**Build Errors**:
```
Type error: Property 'xxx' does not exist
```
- Check TypeScript interfaces in component files
- Ensure all props are properly typed

**Styling Issues**:
```
Class 'xxx' is not defined
```
- Verify Tailwind CSS configuration
- Check if custom classes are defined in `globals.css`

### Performance Optimization

1. **API Response Times**:
   - Monitor OpenAI API usage and rate limits
   - Implement request caching for repeated requests
   - Consider using GPT-3.5-turbo for faster responses

2. **Bundle Size**:
   - Use dynamic imports for large components
   - Optimize images and assets
   - Enable compression in deployment settings

3. **User Experience**:
   - Implement skeleton loading states
   - Add offline support with service workers
   - Optimize for mobile devices

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: All new code must include proper type definitions
- **Testing**: Add tests for new functionality
- **Documentation**: Update README and component documentation
- **Code Style**: Follow existing patterns and use Prettier formatting

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the GPT-4 API that powers our AI generation
- **Vercel**: For the Next.js framework and deployment platform
- **Tailwind CSS**: For the utility-first CSS framework
- **React Community**: For the excellent ecosystem of components and tools

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/yourusername/cover-letter-generator-fresh/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cover-letter-generator-fresh/discussions)

---

**Built with ❤️ for job seekers everywhere. Good luck with your applications!**
