import { useState } from 'react';
import NotebookScene from './scene/NotebookScene';
import DashboardScene from './dashboard/DashboardScene';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScene } from './scene/AuthScene';

function AppContent() {
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const { currentUser } = useAuth(); // Globally tracked Firebase logic

  if (!currentUser) {
    return <AuthScene />;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url(/src/assets/bg.jpg)',
      }}
    >
      {/* Cinematic Vignette Overlay from Top-Left */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 150% 150% at 10% 10%, rgba(255, 235, 195, 0.15) 0%, rgba(0,0,0,0) 40%, rgba(0, 0, 0, 0.7) 100%)',
          boxShadow: 'inset 0 0 180px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.9)'
        }}
      ></div>

      {/* Notebook spanning the whole screen globally so it can pan gracefully in 3D Space */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <NotebookScene isOpen={isNotebookOpen} setIsOpen={setIsNotebookOpen} />
      </div>

      {/* Dashboard Scene with Fade Transition (On Top, Pass-through transparent bounds) */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-1000 ease-in-out pointer-events-none ${isNotebookOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <DashboardScene />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
