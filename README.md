# AI Workflow Animation

A lightweight, professional animated component that showcases how an AI system learns from workflows. Designed to be embedded in a Carrd landing page via iframe.

## Features

- Clean, professional animations using Framer Motion
- Rotating set of workflow tasks with sequentially appearing nodes
- Minimal design with soft connecting lines
- Configurable timing and styling
- Lightweight implementation for fast loading

## Getting Started

### Installation

```bash
# Clone the repository (if applicable)
git clone [repository-url]
cd flingoos-animation

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Embedding in Carrd

After deploying to Vercel, use the following iframe code in your Carrd site:

```html
<iframe 
  src="https://your-deployment-url.vercel.app" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allow="autoplay; fullscreen" 
  allowfullscreen
></iframe>
```

## Customization

### Adding or Modifying Workflows

To update the workflows, edit the `src/data/workflows.ts` file:

```typescript
export const workflows: Workflow[] = [
  {
    id: 'unique-id',
    header: 'Your Workflow Title',
    nodes: [
      { id: 'node-1', label: 'First Step' },
      { id: 'node-2', label: 'Second Step' },
      // Add more steps as needed
    ]
  },
  // Add more workflows as needed
];
```

### Timing Configuration

You can adjust the timing in the `App.tsx` file:

```tsx
<WorkflowAnimation 
  workflows={workflows} 
  cycleTime={8}  // Time in seconds for each workflow
  nodeDelay={0.6}  // Delay between node appearances
/>
```

### Styling

The component uses TailwindCSS for styling. Main colors and styles can be adjusted in:

- `src/index.css` - For CSS variables and global styles
- Individual component files for specific element styling

## Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Deployment

This project is optimized for deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

## License

[Your license information]
