# Workflow Animation Component

A lightweight, professional animated component that showcases how an AI system learns from workflows. This component is designed to be embedded in a Carrd landing page via iframe.

## Features

- Rotating set of task headers with smooth transitions
- Sequential appearance of workflow steps with connecting lines
- Soft highlighting of active nodes and subtle pulse effect for completed nodes
- Clean, professional design with minimal bundle size
- Easily customizable timing, colors, and workflow data

## Getting Started

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/workflow-animation.git
cd workflow-animation
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

4. Build for production:
```
npm run build
```

## Customization

### Modifying Workflows

To customize the workflow examples, edit the `src/data/workflows.ts` file:

```typescript
export const workflows: Workflow[] = [
  {
    id: 'custom-workflow',
    header: 'Your Workflow Title',
    steps: [
      { id: 'step-1', label: 'First Step' },
      { id: 'step-2', label: 'Second Step' },
      // Add more steps as needed
    ]
  },
  // Add more workflows as needed
];
```

### Changing Animation Timing

Animation timing variables are defined in `src/index.css`:

```css
:root {
  --animation-duration: 0.5s;       /* Header fade-in duration */
  --node-appearance-delay: 1s;      /* Delay before first node appears */
  --node-appearance-interval: 0.4s; /* Time between node appearances */
  --full-display-duration: 2s;      /* Time full workflow displays before switching */
  --transition-duration: 0.8s;      /* Fade transition between workflows */
}
```

### Styling Customization

The component uses TailwindCSS for styling. Main colors can be customized in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',   /* Change primary color */
      secondary: '#E2E8F0', /* Change secondary color */
      success: '#10B981',   /* Change success color */
      // Add more custom colors as needed
    },
  },
},
```

## Embedding in Carrd

1. Build the project:
```
npm run build
```

2. Deploy to Vercel or your preferred hosting service.

3. In Carrd, add an Embed element and use the deployed URL as the iframe source:
```html
<iframe src="https://your-deployed-url.vercel.app" frameborder="0" width="100%" height="500px"></iframe>
```

## Optimization Tips

- The component is optimized for minimal bundle size
- For even smaller files, consider removing unused workflows
- Adjust transition timing for best performance on lower-end devices

## License

MIT 