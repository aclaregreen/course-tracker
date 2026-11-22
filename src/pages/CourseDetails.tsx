import CourseOverview from '@/components/courses/CourseOverview';
import NewAssessmentDialog from '@/components/courses/NewAssessmentDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

export default function CourseDetails() {
  const { courseId } = useParams();
  const {
    data: course,
    isPending: coursePending,
    isError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('No course id');
      const { data, error } = await supabase
        .from('courses')
        .select(
          '*, terms(title, start_date, end_date), grading_categories(*), assessments(*)',
        )
        .eq('id', courseId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  if (coursePending) return <p>Loading course...</p>;
  if (isError) return <p>Couldn't load your course. Please try again.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{course.title}</h1>
        </div>
        <NewAssessmentDialog courseId={course.id} />
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="weeks">Weeks</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CourseOverview />
        </TabsContent>
        <TabsContent value="assessments"></TabsContent>
        <TabsContent value="weeks"></TabsContent>
        <TabsContent value="grades"></TabsContent>
      </Tabs>
    </div>
  );
}
