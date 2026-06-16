CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Survey',
  slug TEXT NOT NULL UNIQUE,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  logo_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_surveys_clerk_user_id ON surveys(clerk_user_id);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  config_json TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);

CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  submitted_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);

CREATE TABLE IF NOT EXISTS response_answers (
  id TEXT PRIMARY KEY,
  response_id TEXT NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  value_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_response_answers_response_id ON response_answers(response_id);
