-- db/001_profiles.sql
-- Crea tabla de perfiles 1:1 con auth.users, activa RLS y políticas sensatas.
-- También un trigger para insertar el perfil al crear el usuario.

-- 1) Tabla
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- 2) RLS
alter table public.profiles enable row level security;

-- 3) Políticas: cada quien ve y edita lo suyo
drop policy if exists "select own profile" on public.profiles;
create policy "select own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- 4) Trigger: crear fila en profiles cuando nace un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
