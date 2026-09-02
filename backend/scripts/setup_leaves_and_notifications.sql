-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/mmrpgohxuivgsthofjyq/sql)

-- 1. Create / Update leaves table with date range (start_date to end_date) and total_days
CREATE TABLE IF NOT EXISTS public.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    leave_date DATE NOT NULL,
    end_date DATE,
    total_days INTEGER DEFAULT 1,
    reason TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure end_date and total_days columns exist if leaves table was already created
ALTER TABLE public.leaves ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.leaves ADD COLUMN IF NOT EXISTS total_days INTEGER DEFAULT 1;
UPDATE public.leaves SET end_date = leave_date WHERE end_date IS NULL;
UPDATE public.leaves SET total_days = 1 WHERE total_days IS NULL;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sender_name TEXT DEFAULT 'System',
    type TEXT DEFAULT 'info',
    message TEXT NOT NULL,
    link TEXT DEFAULT '',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Add designation column to users if not present
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS designation TEXT;

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_leaves_user_id ON public.leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_leave_date ON public.leaves(leave_date);
CREATE INDEX IF NOT EXISTS idx_leaves_end_date ON public.leaves(end_date);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.leaves(status);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS access policies
DROP POLICY IF EXISTS "Allow all operations on leaves" ON public.leaves;
CREATE POLICY "Allow all operations on leaves"
ON public.leaves
FOR ALL
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on notifications" ON public.notifications;
CREATE POLICY "Allow all operations on notifications"
ON public.notifications
FOR ALL
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);
