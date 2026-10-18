create table terms (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    title text not null,
    paid boolean not null default false,
    created_at timestamptz not null default now(),
    start_date date not null,
    end_date date not null,
    constraint term_dates_valid check (start_date <= end_date)
);

create index terms_user_id_idx on terms (user_id);

create table courses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    term_id uuid not null references terms (id) on delete cascade,
    title text not null,
    course_code text,
    created_at timestamptz not null default now()
);

create index courses_term_id_idx on courses (term_id);
create index courses_user_id_idx on courses (user_id);

create table grading_categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id uuid not null references courses (id) on delete cascade,
    name text not null,
    drop_lowest integer not null default 0,
    created_at timestamptz not null default now(),
    constraint category_drop_valid check (drop_lowest >= 0)
);

create index grading_categories_user_id_idx on grading_categories (user_id);
create index grading_categories_course_id_idx on grading_categories (course_id);

create table assessments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id uuid not null references courses (id) on delete cascade,
    category_id uuid references grading_categories (id) on delete set null,
    title text not null,
    description text,
    due_date timestamptz,
    created_at timestamptz not null default now(),
    weight numeric not null,
    score numeric,
    completed boolean not null default false,
    constraint assessment_weight_valid check (weight >= 0 and weight <= 100),
    constraint assessment_score_valid check (score >= 0)
);

create index assessments_course_id_idx on assessments (course_id);
create index assessments_user_id_idx on assessments (user_id);
create index assessments_category_id_idx on assessments (category_id);

