import { ChevronUp } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <button className="scroll-top" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <ChevronUp size={24} />
    </button>
  );
}
