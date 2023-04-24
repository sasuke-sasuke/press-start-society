\echo 'Delete and recreate press_start_society db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE press_start_society;
CREATE DATABASE press_start_society;
\connect press_start_society

\i pss-schema.sql
-- \i pss-seed.sql

\echo 'Delete and recreate press_start_society_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE press_start_society_test;
CREATE DATABASE press_start_society_test;
\connect press_start_society_test

\i pss-schema.sql