DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(250) UNIQUE NOT NULL,
    profile_pic TEXT,
    password TEXT NOT NULL
);

CREATE TABLE public.groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(250),
    username TEXT REFERENCES public.users (username) ON DELETE SET NULL
);

CREATE TABLE public.members (
    member_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES public.groups (group_id) ON DELETE CASCADE,
    username TEXT REFERENCES public.users (username) ON DELETE CASCADE,
    CONSTRAINT unique_group_member UNIQUE (group_id, username)
);

CREATE TABLE public.contacts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(250) REFERENCES public.users (username) ON DELETE CASCADE,
    usercontacts TEXT REFERENCES public.users (username) ON DELETE CASCADE,
    UNIQUE (username, usercontacts)
);

CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    sender_id TEXT REFERENCES public.users (username) ON DELETE SET NULL,
    receiver_id TEXT REFERENCES public.users (username) ON DELETE SET NULL,
    message_group INTEGER REFERENCES public.groups (group_id) ON DELETE SET NULL,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL
);

CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_message_group ON messages (message_group);
CREATE INDEX idx_members_username ON members (username);
CREATE INDEX idx_members_group_id ON members (group_id);
