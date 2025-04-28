import React from 'react'
import WorkflowAnimation from './components/WorkflowAnimation'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Learning from Workflows
          </h1>
          <p className="text-gray-600 mt-2">
            Our AI system learns from your workflows to automate and optimize processes.
          </p>
        </header>
        
        <WorkflowAnimation />
        
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Workflow animation demonstration — Powered by AI</p>
        </footer>
      </div>
    </div>
  )
}

export default App 