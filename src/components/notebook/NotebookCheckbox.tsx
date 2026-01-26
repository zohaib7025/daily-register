import { cn } from '@/lib/utils';

interface NotebookCheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export const NotebookCheckbox = ({ checked, onChange, className }: NotebookCheckboxProps) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'notebook-checkbox flex-shrink-0',
        checked && 'checked',
        className
      )}
      aria-checked={checked}
      role="checkbox"
    />
  );
};
