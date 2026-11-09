import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/supabaseClient';
import { useUserId } from '@/useAuth';
import { queryClient } from '@/queryClient';

const courseSchema = z.object({
  title: z.string().trim().min(1, 'Required'),
  courseCode: z.string().trim().min(1, 'Required'),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function NewCourseDialog({ termId }: { termId: string }) {
  const userId = useUserId();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseForm>({ resolver: zodResolver(courseSchema) });

  const createCourse = useMutation({
    mutationFn: async (values: CourseForm) => {
      const { error } = await supabase.from('courses').insert({
        user_id: userId,
        term_id: termId,
        title: values.title,
        course_code: values.courseCode,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['term', termId] });
      reset();
      setOpen(false);
    },
  });
  function onSubmit(values: CourseForm) {
    createCourse.mutate(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Course</Button>
      </DialogTrigger>
      <DialogContent className="form-dialog">
        <DialogHeader>
          <DialogTitle>New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="form-field">
            <Label>Course Code</Label>
            <Input {...register('courseCode')} />
            {errors.courseCode && (
              <p className="error-message">{errors.courseCode.message}</p>
            )}
          </div>
          <div className="form-field">
            <Label>Course Name</Label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button>Create Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
