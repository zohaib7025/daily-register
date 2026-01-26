import { useState } from 'react';
import { Settings, X } from 'lucide-react';

interface NotebookSettingsProps {
  totalDays: number;
  onSetTotalDays: (days: number) => void;
}

export const NotebookSettings = ({ totalDays, onSetTotalDays }: NotebookSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputDays, setInputDays] = useState(totalDays.toString());

  const handleSave = () => {
    const days = parseInt(inputDays);
    if (!isNaN(days) && days >= 1 && days <= 365) {
      onSetTotalDays(days);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all
                   hover:scale-105 active:scale-95"
        aria-label="Settings"
      >
        <Settings size={20} className="text-primary" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-paper rounded-lg shadow-2xl p-6 w-80 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <h3 className="font-handwritten text-2xl font-bold text-primary mb-4">
              Notebook Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="font-handwritten text-lg text-foreground block mb-2">
                  Number of Days (Pages)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={inputDays}
                  onChange={e => setInputDays(e.target.value)}
                  className="w-full p-2 border-2 border-muted rounded bg-background 
                             font-handwritten text-xl focus:outline-none focus:border-primary"
                />
                <p className="font-typewriter text-xs text-muted-foreground mt-1">
                  1 - 365 days allowed
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 bg-primary text-primary-foreground rounded
                           font-handwritten text-xl hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
