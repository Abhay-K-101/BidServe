/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    - `tasks`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `location` (text)
      - `hourly_rate` (integer)
      - `expires_at` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)
    - `bids`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `bidder_id` (uuid, references profiles)
      - `amount` (integer)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text,
  hourly_rate integer NOT NULL,
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (
    category IN ('physical_work', 'homework_help', 'house_chores', 'tutoring', 'other')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('open', 'awarded', 'completed', 'expired')
  )
);

-- Create bids table
CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks NOT NULL,
  bidder_id uuid REFERENCES profiles NOT NULL,
  amount integer NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'accepted', 'rejected', 'outbid')
  )
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Tasks are viewable by everyone"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Task owners can update their tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = owner_id);

-- Bids policies
CREATE POLICY "Bids are viewable by everyone"
  ON bids FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create bids"
  ON bids FOR INSERT
  WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Bid owners can update their bids"
  ON bids FOR UPDATE
  USING (auth.uid() = bidder_id);