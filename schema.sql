-- Create the database
-- CREATE DATABASE "sChat"; -- Comment this line out if you create the database manually

-- Connect to the database (you would typically do this outside the script or add \c sChat)
-- Example for psql: \c sChat

-- Drop tables if they exist to allow for easy recreation (order matters due to foreign keys)
DROP TABLE IF EXISTS members CASCADE; -- Use CASCADE to also drop dependent objects (like foreign keys)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Using SERIAL implicitly creates and manages the sequences,
-- so you typically don't need to explicitly drop or create sequences
-- when using SERIAL unless you've manually created them before.
-- If you run this script multiple times, dropping tables with CASCADE
-- will also drop the sequences created by SERIAL, so no explicit DROP SEQUENCE is needed here.

-- Create the users table
CREATE TABLE public.users
(
    id SERIAL PRIMARY KEY, -- SERIAL will create sequence and set default
    username VARCHAR(250) UNIQUE NOT NULL, -- Added UNIQUE constraint for username
    profile_pic TEXT,
    password TEXT NOT NULL
);


-- Create the groups table
CREATE TABLE public.groups
(
    group_id SERIAL PRIMARY KEY, -- SERIAL
    group_name VARCHAR(250),
    username TEXT REFERENCES public.users (username) ON DELETE SET NULL -- Use username for admin, consistent with backend code
);

-- Create the members table (for group membership)
CREATE TABLE public.members
(
    member_id SERIAL PRIMARY KEY, -- SERIAL
    group_id INTEGER REFERENCES public.groups (group_id) ON DELETE CASCADE, -- group_id is an INTEGER from SERIAL
    username TEXT REFERENCES public.users (username) ON DELETE CASCADE,
    CONSTRAINT unique_group_member UNIQUE (group_id, username) -- Keep the unique constraint
);


-- Create the contacts table
CREATE TABLE public.contacts
(
    id SERIAL PRIMARY KEY, -- SERIAL
    username VARCHAR(250) REFERENCES public.users (username) ON DELETE CASCADE,
    usercontacts TEXT REFERENCES public.users (username) ON DELETE CASCADE,
    UNIQUE (username, usercontacts) -- Keep the unique constraint
);


-- Create the messages table
CREATE TABLE public.messages
(
    id SERIAL PRIMARY KEY, -- SERIAL
    sender_id TEXT REFERENCES public.users (username) ON DELETE SET NULL,
    receiver_id TEXT REFERENCES public.users (username) ON DELETE SET NULL,
    message_group INTEGER REFERENCES public.groups (group_id) ON DELETE SET NULL, -- message_group is an INTEGER
    "timestamp" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL
);

-- Add indexes for performance (optional but recommended)
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_message_group ON messages (message_group);
CREATE INDEX idx_members_username ON members (username);
CREATE INDEX idx_members_group_id ON members (group_id);