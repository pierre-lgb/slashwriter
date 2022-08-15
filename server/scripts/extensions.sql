drop extension if exists citext cascade;
drop extension if exists "uuid-ossp" cascade;
create extension if not exists citext with schema public;
create extension if not exists "uuid-ossp" with schema public;