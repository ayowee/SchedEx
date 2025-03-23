import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Update the document title when the component mounts
    document.title = 'SchedEx';
  }, []);

  return (
    // ... your existing App component code ...
  );
}

export default App; 