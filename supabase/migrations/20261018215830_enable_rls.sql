alter table terms enable row level security;

create policy "Select own terms" on terms
    for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Insert own terms" on terms
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Update own terms" on terms
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Delete own terms" on terms
    for delete to authenticated
    using ((select auth.uid()) = user_id);

alter table courses enable row level security;

create policy "Select own courses" on courses
    for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Insert own courses" on courses
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Update own courses" on courses
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Delete own courses" on courses
    for delete to authenticated
    using ((select auth.uid()) = user_id);


alter table grading_categories enable row level security;

create policy "Select own grading_categories" on grading_categories
    for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Insert own grading_categories" on grading_categories
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Update own grading_categories" on grading_categories
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Delete own grading_categories" on grading_categories
    for delete to authenticated
    using ((select auth.uid()) = user_id);


alter table assessments enable row level security;

create policy "Select own assessments" on assessments
    for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Insert own assessments" on assessments
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Update own assessments" on assessments
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Delete own assessments" on assessments
    for delete to authenticated
    using ((select auth.uid()) = user_id);