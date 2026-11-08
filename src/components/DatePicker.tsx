import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  date,
  onSelect,
  minDate,
  maxDate,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`date-picker-trigger ${className ?? ''}`}
          data-empty={!date}
          disabled={disabled}
        >
          <CalendarIcon />
          {date ? format(date, 'MMM d, yyyy') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="date-picker-popover"
        align="start"
        sideOffset={6}
      >
        <Calendar
          className="date-picker-calendar"
          mode="single"
          selected={date}
          defaultMonth={date ?? minDate}
          onSelect={(selected) => {
            if (selected) onSelect(selected);
            setOpen(false);
          }}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          fixedWeeks
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
