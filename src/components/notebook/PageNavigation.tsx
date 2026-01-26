import { ChevronLeft, ChevronRight, BookOpen, Settings2, Calendar, BarChart3 } from 'lucide-react';
import { PageInfo } from '@/types/notebook';

interface PageNavigationProps {
  currentPageIndex: number;
  totalPages: number;
  currentPageInfo: PageInfo;
  totalDays: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (pageIndex: number) => void;
}

export const PageNavigation = ({
  currentPageIndex,
  totalPages,
  currentPageInfo,
  totalDays,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PageNavigationProps) => {
  const getPageLabel = () => {
    switch (currentPageInfo.type) {
      case 'cover':
        return 'Cover';
      case 'template':
        return 'Template';
      case 'day':
        return `Day ${currentPageInfo.dayNumber}`;
      case 'report':
        return 'Report';
    }
  };

  const getPageIcon = () => {
    switch (currentPageInfo.type) {
      case 'cover':
        return <BookOpen size={16} />;
      case 'template':
        return <Settings2 size={16} />;
      case 'day':
        return <Calendar size={16} />;
      case 'report':
        return <BarChart3 size={16} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-6">
      {/* Quick Navigation Tabs */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => onGoToPage(0)}
          className={`px-3 py-1 rounded-full font-typewriter text-xs transition-all
                     ${currentPageInfo.type === 'cover' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
        >
          Cover
        </button>
        <button
          onClick={() => onGoToPage(1)}
          className={`px-3 py-1 rounded-full font-typewriter text-xs transition-all
                     ${currentPageInfo.type === 'template' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
        >
          Template
        </button>
        <button
          onClick={() => onGoToPage(2)}
          className={`px-3 py-1 rounded-full font-typewriter text-xs transition-all
                     ${currentPageInfo.type === 'day' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
        >
          Days
        </button>
        <button
          onClick={() => onGoToPage(totalDays + 2)}
          className={`px-3 py-1 rounded-full font-typewriter text-xs transition-all
                     ${currentPageInfo.type === 'report' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
        >
          Report
        </button>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrevPage}
          disabled={currentPageIndex === 0}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-30 
                     disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          aria-label="Previous page"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>

        <div className="flex items-center gap-2 bg-paper px-4 py-2 rounded-lg shadow-sm border border-muted">
          {getPageIcon()}
          <span className="font-handwritten text-xl text-foreground min-w-[80px] text-center">
            {getPageLabel()}
          </span>
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPageIndex >= totalPages - 1}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-30 
                     disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          aria-label="Next page"
        >
          <ChevronRight size={24} className="text-primary" />
        </button>
      </div>

      {/* Day Selector (only for day pages) */}
      {currentPageInfo.type === 'day' && (
        <div className="flex justify-center mt-3">
          <select
            value={currentPageIndex}
            onChange={e => onGoToPage(parseInt(e.target.value))}
            className="bg-secondary border border-muted rounded px-3 py-1 
                       font-typewriter text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {Array.from({ length: totalDays }, (_, i) => (
              <option key={i + 2} value={i + 2}>
                Day {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
