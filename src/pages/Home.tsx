import NewTermDialogue from '@/components/NewTermDialogue';
import { supabase } from '@/supabaseClient';
import { useUserId } from '@/useAuth';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

export default function Home() {
  const userId = useUserId();
  const {
    data: terms,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['terms', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Not logged in');
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isPending) return <p>Loading terms...</p>;
  if (isError) return <p>Couldn't load your terms. Please try again.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your terms</h1>
          <p className="page-subtitle">
            Open a term to see its courses, tasks, weeks and grades.
          </p>
        </div>
        <NewTermDialogue />
      </div>

      {terms.length === 0 ? (
        <p>No terms yet</p>
      ) : (
        <div className="card-grid">
          {terms.map((term) => (
            <div key={term.id} className="content-card">
              <div className="content-card-header">
                <h3 className="content-card-title">{term.title}</h3>
              </div>
              <p className="content-card-subtitle">
                {format(parseISO(term.start_date), 'MMM d')} –{' '}
                {format(parseISO(term.end_date), 'MMM d')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
