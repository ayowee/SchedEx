import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SlotAddingPage from './pages/SlotAddingPage';
import SlotManagingPage from './pages/SlotManagingPage';
import './App.css';
import { SlotProvider } from './context/SlotContext';

function App() {
  return (
    <SlotProvider>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-gray-900">SchedEx</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <Link
                        to="/managing-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                      </Link>
                      <Link
                        to="/create-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Manage Slots
                      </Link>
                      <Link
                        to="/managing-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Add Slots
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/managing-slot" element={<SlotManagingPage />} />
              <Route path="/create-slot" element={<SlotAddingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SlotProvider>
  );
}

export default App;
