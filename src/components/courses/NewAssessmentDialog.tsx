import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { queryClient } from '@/queryClient';
import { useUserId } from '@/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@/components/DatePicker';
import { supabase } from '@/supabaseClient';
import { set } from 'date-fns';
import z from 'zod';

const assessmentSchema = z.object({
  title: z.string().trim().min(1, 'Required'),
  description: z.string().trim().optional(),
  dueDate: z.date().optional(),
  dueTime: z.string(),
  weight: z.number({ error: 'Required' }).min(0).max(100),
});

type AssessmentForm = z.infer<typeof assessmentSchema>;

export default function NewAssessmentDialog({
  courseId,
}: {
  courseId: string;
}) {
  const userId = useUserId();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { dueTime: '23:59' },
  });

  const createAssessment = useMutation({
    mutationFn: async (values: AssessmentForm) => {
      const [hours, minutes] = values.dueTime.split(':').map(Number);

      const { error } = await supabase.from('assessments').insert({
        user_id: userId,
        course_id: courseId,
        title: values.title,
        description: values.description || null,
        due_date: values.dueDate
          ? set(values.dueDate, { hours, minutes }).toISOString()
          : null,
        weight: values.weight,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      reset();
      setOpen(false);
    },
  });

  function onSubmit(values: AssessmentForm) {
    createAssessment.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Assessment</Button>
      </DialogTrigger>
      <DialogContent className="form-dialog">
        <DialogHeader>
          <DialogTitle>Add Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="form-field">
            <Label>Name</Label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>
          <div className="form-field">
            <Label>Description</Label>
            <Input {...register('description')} />
            {errors.description && (
              <p className="error-message">{errors.description.message}</p>
            )}
          </div>
          <div className="form-field">
            <Label>Due date</Label>
            <div className="date-time-row">
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <DatePicker date={field.value} onSelect={field.onChange} />
                )}
              />
              <Input type="time" {...register('dueTime')} />
            </div>
          </div>
          <div className="form-field">
            <Label>Weight</Label>
            <Input
              type="number"
              {...register('weight', { valueAsNumber: true })}
            />
            {errors.weight && (
              <p className="error-message">{errors.weight.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
