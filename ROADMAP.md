# Workflow Animation Component Roadmap

## Project Overview
A lightweight, professional animated component showcasing how an AI system learns from workflows, to be embedded in a Carrd landing page.

## Tech Stack
- ✅ React (latest)
- ✅ Framer Motion (for animation control)
- ✅ SVG (for nodes and connection lines)
- ✅ TailwindCSS (for styling)
- ✅ Vercel (for deployment)

## Key Requirements
- ✅ Professional, minimal design with react-flow-graph-like style
- ✅ Rotating task headers with 4-5 nodes appearing sequentially
- ✅ Clean transitions without flashy effects
- ✅ Soft highlighting of current node and subtle pulse effect on completed nodes
- ✅ Lightweight implementation for fast loading

## Development Roadmap

### Phase 1: Project Setup & Core Structure
- [x] Initialize React project with Vite for fast development
- [x] Set up TailwindCSS configuration
- [x] Install Framer Motion dependency
- [x] Create project directory structure
- [x] Add base styling and theme variables
- [ ] Setup deployment pipeline with Vercel

### Phase 2: Base Component Development
- [x] Design node component with SVG
- [x] Implement basic task header component
- [x] Create container layout for the animation
- [x] Implement SVG connection lines between nodes
- [x] Add responsive design constraints for iframe embedding

### Phase 3: Animation Implementation
- [x] Set up Framer Motion animation sequences
- [x] Implement header fade-in/fade-out animation
- [x] Create node appearance animation sequence
- [x] Implement connection line animations
- [x] Add node highlighting for current active node
- [x] Add subtle pulse effect for completed nodes
- [x] Configure animation timing according to specifications

### Phase 4: Task Flow Management
- [x] Create task data structure for sample workflows
- [x] Implement task rotation logic
- [x] Add smooth transitions between different tasks
- [x] Ensure proper looping of all task examples
- [x] Create customizable timing parameters

### Phase 5: Refinement & Optimization
- [x] Optimize animation performance
- [x] Reduce bundle size
- [x] Implement proper cleanup for animation lifecycles
- [x] Add configuration options for easy customization
- [ ] Test in various viewport sizes
- [ ] Ensure accessibility standards are met

### Phase 6: Documentation & Deployment
- [x] Complete README with usage instructions
- [x] Document customization options
- [ ] Deploy to Vercel
- [ ] Test iframe embedding in sample Carrd page
- [ ] Prepare final deliverable with iframe embed code

## Task Examples

| Header | Nodes (Steps) |
|--------|---------------|
| Invoice Processing | Receive Invoice → Extract Data → Match to PO → Approve → Book in ERP |
| Client Onboarding | Gather Documents → Identity Verification → Compliance Check → Create Account |
| Expense Approval | Submit Request → Manager Review → Finance Audit → Payment Initiated |
| Audit Prep | Pull Data → Organize Accounts → Flag Exceptions → Generate Report |
| Data Reconciliation | Import Bank Feed → Cross-check Ledger → Identify Mismatches → Resolve Issues |

## Animation Timing
- Header fade-in: 0.5s
- First node appear: after 1.0s
- Each subsequent node appear: 0.4s gap
- Full display duration: 2s before switching to next task
- Transition between tasks: smooth fade-out/fade-in

## Success Criteria
- ✅ Lightweight component that loads quickly
- ✅ Professional, VC-grade animation quality
- ✅ Smooth transitions and timing
- ✅ Clean, breathable design
- ✅ Easy to embed in Carrd landing page 