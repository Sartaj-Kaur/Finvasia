import SavingsBoardUI from './SavingsBoardUI';
import { LetterCard } from './LetterCard';
import { StickyNotes } from './StickyNotes';
import { Wallet } from './Wallet';
import { FileFolderCard } from './FileFolderCard';

export default function DashboardScene() {
  return (
    <>
      <style>{`
        /* ── Dashboard responsive layout ── */
        .dash-root {
          position: relative;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Wallet: between sticky notes (top-right) and folder (bottom-right), fully on-screen */
        .dash-wallet {
          position: absolute;
          top: 42%;
          right: 2%;
          z-index: 15;
          pointer-events: auto;
        }

        /* SavingsBoard: top-center-right area */
        .dash-savings {
          position: absolute;
          top: clamp(3%, 6vh, 10%);
          left: clamp(38%, 42vw, 48%);
          z-index: 10;
          pointer-events: auto;
        }

        /* LetterCard: bottom-center */
        .dash-letter {
          position: absolute;
          bottom: clamp(2%, 4vh, 8%);
          left: clamp(38%, 44vw, 50%);
          z-index: 10;
          pointer-events: auto;
        }

        /* FileFolderCard: bottom-right, stays clear of right edge */
        .dash-folder {
          position: absolute;
          bottom: clamp(2%, 4vh, 8%);
          right: clamp(2%, 5vw, 10%);
          z-index: 20;
          pointer-events: auto;
        }

        /* StickyNotes: top-right, sits inside viewport on all sizes */
        .dash-sticky {
          position: absolute;
          top: clamp(4%, 8vh, 12%);
          right: clamp(2%, 5vw, 8%);
          z-index: 30;
          pointer-events: auto;
        }

        /* ── Scale helpers applied to children ── */
        .dash-savings > *,
        .dash-letter > *,
        .dash-folder > * {
          transform-origin: top left;
        }

        /* On screens narrower than 1280px shrink the board + letter */
        @media (max-width: 1280px) {
          .dash-savings { left: 40%; }
          .dash-letter  { left: 40%; bottom: 2%; }
          .dash-folder  { right: 2%; bottom: 2%; }
          .dash-sticky  { right: 2%; }
        }

        @media (max-width: 1100px) {
          .dash-savings { left: 38%; top: 4%; }
          .dash-letter  { display: none; }
          .dash-folder  { right: 1%; bottom: 1%; }
        }

        @media (max-width: 900px) {
          .dash-savings { left: 32%; top: 3%; }
          .dash-folder  { display: none; }
          .dash-sticky  { display: none; }
        }
      `}</style>

      <div className="dash-root">

        {/* Wallet: peeks from the right edge */}
        <div className="dash-wallet">
          <Wallet />
        </div>

        {/* Savings Board: upper-center-right */}
        <div className="dash-savings">
          <SavingsBoardUI />
        </div>

        {/* Letter Card: lower-center */}
        <div className="dash-letter">
          <LetterCard />
        </div>

        {/* File Folder: lower-right */}
        <div className="dash-folder">
          <FileFolderCard />
        </div>

        {/* Sticky Notes: top-right */}
        <div className="dash-sticky">
          <StickyNotes />
        </div>

      </div>
    </>
  );
}
