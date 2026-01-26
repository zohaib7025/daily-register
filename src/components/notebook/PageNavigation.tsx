import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

export const PageNavigation = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PageNavigationProps) => {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all
                   hover:scale-105 active:scale-95"
        aria-label="Previous page"
      >
        <ChevronLeft size={24} className="text-primary" />
      </button>

      <div className="flex items-center gap-2">
        <span className="font-handwritten text-xl text-muted-foreground">Page</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={e => {
            const page = parseInt(e.target.value);
            if (!isNaN(page)) onGoToPage(page);
          }}
          className="w-16 text-center font-handwritten text-2xl font-bold text-primary 
                     bg-transparent border-b-2 border-primary focus:outline-none"
        />
        <span className="font-handwritten text-xl text-muted-foreground">of {totalPages}</span>
      </div>

      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all
                   hover:scale-105 active:scale-95"
        aria-label="Next page"
      >
        <ChevronRight size={24} className="text-primary" />
      </button>
    </div>
  );
};
