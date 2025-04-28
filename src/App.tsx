import { WorkflowAnimation } from './components/WorkflowAnimation'
import { workflows } from './data/workflows'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8">
          <h1 className="text-white text-xl font-medium">AI Learning from Workflows</h1>
          <p className="text-blue-100 text-sm mt-2">See how our system learns and automates your processes</p>
        </header>
        
        <main className="p-6">
          <WorkflowAnimation 
            workflows={workflows} 
            cycleTime={8} 
            nodeDelay={0.6} 
          />
        </main>
      </div>
    </div>
  )
}

export default App
