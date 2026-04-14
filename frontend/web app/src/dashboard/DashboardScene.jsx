import { LetterCard } from './LetterCard';
import { ClipboardCard } from './ClipboardCard';
import { Wallet } from './Wallet';
import { PetAgent } from './PetAgent';
import { MicroWealthCard } from './MicroWealthCard';
import { CoffeeCup } from './CoffeeCup';
import { DeskPencil, DeskCalendar } from './DeskAccessories';

export default function DashboardScene({ isOpen }) {
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

        .dash-root.is-open .dash-wallet,
        .dash-root.is-open .dash-savings,
        .dash-root.is-open .dash-clipboard,
        .dash-root.is-open .dash-letter,
        .dash-root.is-open .dash-microwealth,
        .dash-root.is-open .dash-calendar,
        .dash-root.is-open .dash-pencil,
        .dash-root.is-open .dash-coffee {
          pointer-events: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        /* Wallet: between sticky notes (top-right) and folder (bottom-right), fully on-screen */
        .dash-wallet {
          position: absolute;
          top: 42%;
          right: 2%;
          z-index: 15;
          pointer-events: auto;
        }

        /* MicroWealthCard: Top-right corner on the desk */
        .dash-microwealth {
          position: absolute;
          top: clamp(2%, 4vh, 8%);
          right: clamp(2%, 4vw, 8%);
          z-index: 11;
          pointer-events: auto;
        }

        /* CoffeeCup: Decorative item on the bottom right near agent */
        .dash-coffee {
          position: absolute;
          bottom: clamp(8%, 15vh, 20%);
          right: clamp(10%, 15vw, 20%);
          z-index: 9;
          pointer-events: none;
        }

        /* DeskPencil: Resting near the coffee cup */
        .dash-pencil {
          position: absolute;
          bottom: clamp(2%, 6vh, 10%);
          right: clamp(8%, 14vw, 20%);
          z-index: 10; /* Boost slightly to let it optionally overlap mug */
          pointer-events: none;
        }

        /* DeskCalendar: Below the wax seal stamp on the envelope */
        .dash-calendar {
          position: absolute;
          top: clamp(20%, 26vh, 30%);
          left: clamp(7%, 10vw, 14%);
          right: auto;
          z-index: 15; 
          pointer-events: auto;
        }



        /* LetterCard: top-left */
        .dash-letter {
          position: absolute;
          top: clamp(4%, 8vh, 12%);
          left: clamp(4%, 6vw, 10%);
          z-index: 10;
          pointer-events: auto;
        }

        /* ClipboardCard: bottom-left */
        .dash-clipboard {
          position: absolute;
          bottom: clamp(2%, 4vh, 8%);
          left: clamp(4%, 7vw, 10%);
          z-index: 12;
          pointer-events: auto;
        }



        /* ── Scale helpers applied to children ── */
        .dash-savings > *,
        .dash-letter > *,
        .dash-clipboard > *,
        .dash-coffee > *,
        .dash-pencil > *,
        .dash-calendar > * {
          transform-origin: top left;
        }
        
        .dash-microwealth > * {
          transform-origin: top right;
        }

        /* On screens narrower than 1280px shrink the board + letter */
        @media (max-width: 1280px) {
          .dash-letter  { left: 2%; top: 4%; }
          .dash-clipboard { left: 4%; bottom: 2%; }
          .dash-coffee { right: 14%; bottom: 10%; transform: scale(0.9); }
          .dash-pencil { right: 12%; bottom: 6%; transform: scale(0.9); }
          .dash-microwealth { right: 2%; top: 2%; transform: scale(0.9); transform-origin: top right; }
          .dash-calendar { left: auto; right: 4%; top: 44%; transform: scale(0.9); }
        }

        @media (max-width: 1100px) {
          .dash-letter  { display: none; }
          .dash-clipboard { left: 1%; bottom: 1%; }
          .dash-coffee { right: 10%; bottom: 8%; transform: scale(0.85); }
          .dash-pencil { right: 8%; bottom: 4%; transform: scale(0.85); }
          .dash-microwealth { right: 1%; top: 1%; transform: scale(0.85); transform-origin: top right; }
          .dash-calendar { left: auto; right: 2%; top: 40%; transform: scale(0.85); }
        }

        @media (max-width: 900px) {
          .dash-clipboard { display: none; }
          .dash-coffee { right: 6%; bottom: 5%; transform: scale(0.7); }
          .dash-pencil { right: 4%; bottom: 2%; transform: scale(0.7); }
          .dash-microwealth { right: 1%; top: 1%; transform: scale(0.8); transform-origin: top right; }
          .dash-calendar { left: auto; right: 2%; top: 35%; transform: scale(0.8); }
        }
      `}</style>

      <div className={`dash-root ${isOpen ? 'is-open' : ''}`}>

        {/* Wallet: peeks from the right edge */}
        <div className="dash-wallet">
          <Wallet />
        </div>

        {/* Decorative Coffee Cup: bottom right near agent */}
        <div className="dash-coffee">
          <CoffeeCup />
        </div>

        {/* MicroWealth Stamp Card: standalone paper on the desk */}
        <div className="dash-microwealth">
          <MicroWealthCard />
        </div>

        {/* Live Desk Calendar: Top center */}
        <div className="dash-calendar">
          <DeskCalendar />
        </div>

        {/* Decorative Pencil: Near Coffee */}
        <div className="dash-pencil">
          <DeskPencil />
        </div>

        {/* Letter Card: top-left */}
        <div className="dash-letter">
          <LetterCard />
        </div>

        {/* Clipboard: bottom-left */}
        <div className="dash-clipboard">
          <ClipboardCard />
        </div>

        {/* Pet Agent: bottom center */}
        <PetAgent />

      </div>
    </>
  );
}
