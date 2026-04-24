-- Onegodian University LMS custom tables
-- Prefix shown as wp_, but runtime uses $wpdb->prefix.

CREATE TABLE wp_og_enrollments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  enrolled_at DATETIME NOT NULL,
  expires_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY user_course (user_id, course_id),
  KEY status (status)
);

CREATE TABLE wp_og_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  lesson_id BIGINT UNSIGNED NOT NULL,
  completion_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY user_course (user_id, course_id),
  KEY lesson_id (lesson_id)
);

CREATE TABLE wp_og_quiz_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  quiz_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
  started_at DATETIME NOT NULL,
  submitted_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY quiz_user (quiz_id, user_id),
  KEY status (status)
);

CREATE TABLE wp_og_quiz_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  answer LONGTEXT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY attempt_question (attempt_id, question_id)
);

CREATE TABLE wp_og_assignment_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  assignment_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  submission_text LONGTEXT NULL,
  file_url TEXT NULL,
  grade DECIMAL(5,2) NULL,
  feedback LONGTEXT NULL,
  submitted_at DATETIME NOT NULL,
  graded_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY assignment_user (assignment_id, user_id)
);

CREATE TABLE wp_og_certificates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  certificate_uid VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  issued_at DATETIME NOT NULL,
  pdf_url TEXT NULL,
  verification_hash VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY certificate_uid (certificate_uid),
  KEY user_course (user_id, course_id)
);

CREATE TABLE wp_og_payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NULL,
  provider VARCHAR(40) NOT NULL,
  transaction_id VARCHAR(128) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(30) NOT NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY transaction_id (transaction_id),
  KEY user_id (user_id),
  KEY status (status)
);

CREATE TABLE wp_og_live_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'zoom',
  provider_session_id VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  join_url TEXT NOT NULL,
  replay_url TEXT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY course_start (course_id, start_at)
);

CREATE TABLE wp_og_attendance (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  live_session_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  attended_at DATETIME NOT NULL,
  duration_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY session_user (live_session_id, user_id)
);

CREATE TABLE wp_og_activity_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  event_type VARCHAR(80) NOT NULL,
  object_type VARCHAR(80) NOT NULL,
  object_id BIGINT UNSIGNED NULL,
  context LONGTEXT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY event_type (event_type),
  KEY user_id (user_id)
);
