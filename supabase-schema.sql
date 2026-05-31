-- ============================================================
--  Jen's Mini Mart — Supabase SQL Schema
--  I-paste ni sa: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. PRODUCTS
create table products (
  id          bigint primary key generated always as identity,
  barcode     text unique not null,
  name        text not null,
  price       numeric not null,
  created_at  timestamptz default now()
);

-- 2. SALES (cash + utang transactions)
create table sales (
  id    bigint primary key generated always as identity,
  items jsonb not null,
  total numeric not null,
  type  text not null check (type in ('cash', 'utang')),
  date  timestamptz default now()
);

-- 3. DEBTS (current balance per customer)
create table debts (
  id         bigint primary key generated always as identity,
  name       text not null,
  balance    numeric not null default 0,
  created_at timestamptz default now()
);

-- 4. DEBT HISTORY (per-purchase breakdown)
create table debt_history (
  id      bigint primary key generated always as identity,
  debt_id bigint references debts(id) on delete cascade,
  items   jsonb not null,
  total   numeric not null,
  date    timestamptz default now()
);

-- ============================================================
--  ALLOW PUBLIC ACCESS (since no login/auth needed)
--  (Row Level Security — allow all for anon key)
-- ============================================================
alter table products    enable row level security;
alter table sales       enable row level security;
alter table debts       enable row level security;
alter table debt_history enable row level security;

create policy "Allow all" on products     for all using (true) with check (true);
create policy "Allow all" on sales        for all using (true) with check (true);
create policy "Allow all" on debts        for all using (true) with check (true);
create policy "Allow all" on debt_history for all using (true) with check (true);
