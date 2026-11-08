import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { queryClient } from '@/queryClient';
import { supabase } from '@/supabaseClient';
import { useUserId } from '@/useAuth';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';

export default function NewTermDialogue() {
  const userId = useUserId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [formError, setFormError] = useState<string | null>(null);

  const createTerm = useMutation({
    mutationFn: async (term: {
      title: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const { error } = await supabase.from('terms').insert({
        user_id: userId,
        title: term.title,
        start_date: format(term.startDate, 'yyyy-MM-dd'),
        end_date: format(term.endDate, 'yyyy-MM-dd'),
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['terms', userId] });
      setOpen(false);
      setTitle('');
      setStartDate(undefined);
      setEndDate(undefined);
    },
  });

  function handleCreate() {
    if (!title.trim() || !startDate || !endDate) {
      setFormError('Please fill in all fields');
      return;
    }
    if (endDate < startDate) {
      setFormError('End date must be on or after the start date');
      return;
    }
    setFormError(null);
    createTerm.mutate({ title, startDate, endDate });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Term</Button>
      </DialogTrigger>
      <DialogContent className="form-dialog">
        <DialogHeader>
          <DialogTitle>New Term</DialogTitle>
        </DialogHeader>
        <div className="form-field">
          <Label>Term Name</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <Label>Start Date</Label>
          <DatePicker date={startDate} onSelect={setStartDate} />
        </div>
        <div className="form-field">
          <Label>End Date</Label>
          <DatePicker date={endDate} onSelect={setEndDate} />
        </div>
        {formError && <p className="error-message">{formError}</p>}
        <DialogFooter>
          <Button onClick={handleCreate}>Create Term</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
