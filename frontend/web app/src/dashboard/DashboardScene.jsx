import SavingsBoardUI from './SavingsBoardUI';
import { LetterCard } from './LetterCard';
import { StickyNotes } from './StickyNotes';
import { Wallet } from './Wallet';
import { FileFolderCard } from './FileFolderCard';
export default function DashboardScene() {
  return (
    <div className="relative w-full h-full pointer-events-none">

      {/* Wallet Section: Top Right */}
      <div className="absolute top-[42%] left-[98%] z-10 pointer-events-auto">
        <Wallet />
      </div>

      {/* Premium Savings Board: In-place of the previous paper */}
      <div className="absolute top-[8%] left-[42%] z-10 pointer-events-auto">
        <SavingsBoardUI />
      </div>



      {/* Letter Card: Center beneath Savings Board */}
      <div className="absolute top-[70%] left-[44%] z-10 pointer-events-auto">
        <LetterCard />
      </div>

      {/* Minimal File Folder Card: Lower Center-Right */}
      <div className="absolute top-[70%] right-[10%] xl:right-[5%] z-20 pointer-events-auto">
        <FileFolderCard />
      </div>

      {/* Sticky Notes: Top Right */}
      <div className="absolute top-[8%] right-[6%] z-30 pointer-events-auto">
        <StickyNotes />
      </div>
    </div>
  );
}
