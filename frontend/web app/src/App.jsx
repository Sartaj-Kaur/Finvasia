import { useState } from 'react';
import NotebookScene from './scene/NotebookScene';
import DashboardScene from './dashboard/DashboardScene';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScene } from './scene/AuthScene';
import MonthSelector from './scene/MonthSelector';

function AppContent() {
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const { currentUser } = useAuth();

  // Derive earliest allowed month from account creation date
  const creationDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime)
    : new Date();
  const earliestMonth = creationDate.getMonth();
  const earliestYear  = creationDate.getFullYear();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

  const handleMonthChange = (m, y) => {
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  if (!currentUser) {
    return <AuthScene />;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/src/assets/bg.jpg)' }}
    >
      {/* Cinematic Vignette Overlay from Top-Left */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 150% 150% at 10% 10%, rgba(255, 235, 195, 0.15) 0%, rgba(0,0,0,0) 40%, rgba(0, 0, 0, 0.7) 100%)',
          boxShadow: 'inset 0 0 180px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.9)'
        }}
      />

      {/* Notebook spanning the whole screen */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <NotebookScene
          isOpen={isNotebookOpen}
          setIsOpen={setIsNotebookOpen}
          month={selectedMonth}
          year={selectedYear}
        />
      </div>

      {/* Vintage Month Selector — only visible when notebook is open */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-in-out"
        style={{
          opacity: isNotebookOpen ? 1 : 0,
          pointerEvents: isNotebookOpen ? 'auto' : 'none',
          transform: `translateX(-50%) translateY(${isNotebookOpen ? '0px' : '12px'})`,
        }}
      >
        <div
          className="px-6 py-3 rounded-sm"
          style={{
            background: 'rgba(240, 224, 192, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1.5px solid rgba(140, 96, 48, 0.45)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.5)'
          }}
        >
          <MonthSelector
            month={selectedMonth}
            year={selectedYear}
            earliestMonth={earliestMonth}
            earliestYear={earliestYear}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Dashboard Scene with Fade Transition */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-1000 ease-in-out pointer-events-none ${isNotebookOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <DashboardScene isOpen={isNotebookOpen} />
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
