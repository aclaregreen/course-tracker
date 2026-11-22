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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const termSchema = z
  .object({
    title: z.string().trim().min(1, 'Required'),
    startDate: z.date({ error: 'Required' }),
    endDate: z.date({ error: 'Required' }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });

type termForm = z.infer<typeof termSchema>;

export default function NewTermDialogue() {
  const userId = useUserId();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<termForm>({ resolver: zodResolver(termSchema) });

  const createTerm = useMutation({
    mutationFn: async (term: termForm) => {
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
      reset();
      setOpen(false);
    },
  });

  function onSubmit(values: termForm) {
    createTerm.mutate(values);
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
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="form-field">
            <Label>Term Name</Label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>
          <div className="form-field">
            <Label>Start Date</Label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker date={field.value} onSelect={field.onChange} />
              )}
            />
            {errors.startDate && (
              <p className="error-message">{errors.startDate.message}</p>
            )}
          </div>
          <div className="form-field">
            <Label>End Date</Label>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker date={field.value} onSelect={field.onChange} />
              )}
            />
            {errors.endDate && (
              <p className="error-message">{errors.endDate.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button>Create Term</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
