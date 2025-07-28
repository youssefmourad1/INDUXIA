-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('plant_director', 'maintenance_manager', 'production_supervisor', 'operator', 'admin');

-- Create asset status enum
CREATE TYPE public.asset_status AS ENUM ('healthy', 'warning', 'critical', 'offline');

-- Create work order status enum
CREATE TYPE public.work_order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Create work order priority enum
CREATE TYPE public.work_order_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create agent status enum
CREATE TYPE public.agent_status AS ENUM ('active', 'inactive', 'error', 'maintenance');

-- Create agent type enum
CREATE TYPE public.agent_type AS ENUM ('route_optimization', 'inventory_management', 'predictive_maintenance', 'quality_control', 'energy_optimization');

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'operator',
    avatar_url TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create plants table
CREATE TABLE public.plants (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create assets table
CREATE TABLE public.assets (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status asset_status NOT NULL DEFAULT 'healthy',
    oee DECIMAL(5,2) DEFAULT 0.0,
    location_x DECIMAL(10,2),
    location_y DECIMAL(10,2),
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    plant_id UUID REFERENCES public.plants(id),
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create work orders table
CREATE TABLE public.work_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    asset_id UUID REFERENCES public.assets(id),
    assigned_to UUID REFERENCES public.profiles(id),
    created_by UUID REFERENCES public.profiles(id),
    priority work_order_priority NOT NULL DEFAULT 'medium',
    status work_order_status NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create AI agents table
CREATE TABLE public.ai_agents (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type agent_type NOT NULL,
    status agent_status NOT NULL DEFAULT 'inactive',
    n8n_workflow_id TEXT,
    configuration JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    last_execution TIMESTAMP WITH TIME ZONE,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority work_order_priority NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'active',
    asset_id UUID REFERENCES public.assets(id),
    source TEXT NOT NULL,
    confidence DECIMAL(5,2),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create production lines table
CREATE TABLE public.production_lines (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plant_id UUID REFERENCES public.plants(id),
    throughput DECIMAL(10,2) DEFAULT 0.0,
    quality_rate DECIMAL(5,2) DEFAULT 0.0,
    micro_stoppages INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'stopped',
    target_throughput DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create quality incidents table
CREATE TABLE public.quality_incidents (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    defect_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'minor',
    line_id UUID REFERENCES public.production_lines(id),
    image_url TEXT,
    description TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id)
);

-- Create suppliers table
CREATE TABLE public.suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    performance_rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT,
    current_stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 1000,
    unit_price DECIMAL(10,2),
    supplier_id UUID REFERENCES public.suppliers(id),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create deliveries table
CREATE TABLE public.deliveries (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.suppliers(id),
    status TEXT NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    actual_date TIMESTAMP WITH TIME ZONE,
    destination_address TEXT,
    optimized_route JSONB,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for work orders (users can see all, but only assigned users can update)
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create work orders" ON public.work_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Assigned users can update work orders" ON public.work_orders FOR UPDATE TO authenticated USING (assigned_to = auth.uid() OR created_by = auth.uid());

-- Create RLS policies for assets (all authenticated users can view)
CREATE POLICY "Authenticated users can view assets" ON public.assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update assets" ON public.assets FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for AI agents (all authenticated users can view)
CREATE POLICY "Authenticated users can view ai agents" ON public.ai_agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage ai agents" ON public.ai_agents FOR ALL TO authenticated USING (true);

-- Create RLS policies for alerts (all authenticated users can view)
CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);

-- Create RLS policies for production lines (all authenticated users can view)
CREATE POLICY "Authenticated users can view production lines" ON public.production_lines FOR SELECT TO authenticated USING (true);

-- Create RLS policies for quality incidents (all authenticated users can view)
CREATE POLICY "Authenticated users can view quality incidents" ON public.quality_incidents FOR SELECT TO authenticated USING (true);

-- Create RLS policies for suppliers (all authenticated users can view)
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);

-- Create RLS policies for inventory (all authenticated users can view)
CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items FOR SELECT TO authenticated USING (true);

-- Create RLS policies for deliveries (all authenticated users can view)
CREATE POLICY "Authenticated users can view deliveries" ON public.deliveries FOR SELECT TO authenticated USING (true);

-- Create RLS policies for notifications (users can only see their own)
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for plants (all authenticated users can view)
CREATE POLICY "Authenticated users can view plants" ON public.plants FOR SELECT TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON public.plants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_production_lines_updated_at BEFORE UPDATE ON public.production_lines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'operator')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for key tables
ALTER TABLE public.assets REPLICA IDENTITY FULL;
ALTER TABLE public.work_orders REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.ai_agents REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.work_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents;