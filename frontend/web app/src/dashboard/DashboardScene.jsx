import { SavingsCard } from './SavingsCard';
import { LetterCard } from './LetterCard';
import { StickyNotes } from './StickyNotes';
import { Wallet } from './Wallet';


export default function DashboardScene() {
  return (
    <div className="relative w-full h-full pointer-events-none">

      {/* Wallet Section: Top Right */}
      <div className="pointer-events-auto">
        <Wallet />
      </div>

      {/* Savings Challenge Card: Top Center/Right */}
      <div className="absolute top-[8%] left-[48%] z-10 pointer-events-auto">
        <SavingsCard />
      </div>



      {/* Letter Card: Right Top */}
      <div className="absolute top-[22%] right-[5%] z-10 pointer-events-auto">
        <LetterCard />
      </div>

      {/* Sticky Notes: Middle Right */}
      <div className="absolute top-[55%] right-[8%] z-30 pointer-events-auto">
        <StickyNotes />
      </div>
    </div>
  );
}
