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
                        to="/"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Manage Slots
                      </Link>
                      <Link
                        to="/add-slots"
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
              <Route path="/slots" element={<SlotManagingPage />} />
              <Route path="/create-slot" element={<SlotAddingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SlotProvider>
  );
}

export default App;
