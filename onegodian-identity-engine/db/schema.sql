create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists identity_artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  full_name text not null,
  calling text not null,
  promise text not null,
  preview_text text not null,
  declaration_card_url text,
  obsidian_seal_url text,
  preview_only boolean default true,
  hd_ready boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  artifact_id uuid references identity_artifacts(id),
  stripe_session_id text unique not null,
  email text,
  tier text not null check (tier in ('starter','premium','founder')),
  referral_code text,
  amount_total integer not null,
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists download_history (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  artifact_id uuid references identity_artifacts(id),
  order_id bigint references orders(id),
  download_url text not null,
  downloaded_at timestamptz default now()
);

create table if not exists referrals (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  code text unique not null,
  conversions integer default 0,
  revenue_cents integer default 0,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table identity_artifacts enable row level security;
alter table orders enable row level security;
alter table download_history enable row level security;
alter table referrals enable row level security;
