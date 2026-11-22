import NewCourseDialog from '@/components/NewCourseDialog';
import { supabase } from '@/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';

export default function TermDetails() {
  const { termId } = useParams();
  const {
    data: term,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['term', termId],
    queryFn: async () => {
      if (!termId) throw new Error('No term id');
      const { data, error } = await supabase
        .from('terms')
        .select('*, courses(*)')
        .eq('id', termId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!termId,
  });

  if (isPending) return <p>Loading term...</p>;
  if (isError) return <p>Couldn't load your term. Please try again.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{term.title}</h1>
          <p></p>
        </div>
        <NewCourseDialog termId={term.id} />
      </div>
      {term.courses.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        <div className="card-grid">
          {term.courses.map((course) => (
            <Link
              key={course.id}
              to={`/terms/${term.id}/courses/${course.id}`}
              className="content-card"
            >
              <div className="content-card-header">
                <h3 className="content-card-title">{course.title}</h3>
              </div>
              <p className="content-card-subtitle">{course.course_code}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
