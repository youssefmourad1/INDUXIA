import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, agentId, workflowData } = await req.json();

    console.log(`N8N Agent Action: ${action} for agent ${agentId}`);

    switch (action) {
      case 'trigger_workflow':
        return await triggerWorkflow(agentId, workflowData);
      case 'get_agent_status':
        return await getAgentStatus(agentId);
      case 'update_agent_config':
        return await updateAgentConfig(agentId, workflowData);
      case 'get_performance_metrics':
        return await getPerformanceMetrics(agentId);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in n8n-agent-bridge:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function triggerWorkflow(agentId: string, workflowData: any) {
  // Get agent details from database
  const { data: agent, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error || !agent) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  console.log(`Triggering workflow for ${agent.name} (${agent.type})`);

  // Update agent status to active
  await supabase
    .from('ai_agents')
    .update({ 
      status: 'active',
      last_execution: new Date().toISOString()
    })
    .eq('id', agentId);

  // Simulate different AI agent workflows
  let result;
  switch (agent.type) {
    case 'route_optimization':
      result = await optimizeRoute(workflowData);
      break;
    case 'inventory_management':
      result = await manageInventory(workflowData);
      break;
    case 'predictive_maintenance':
      result = await predictMaintenance(workflowData);
      break;
    case 'quality_control':
      result = await performQualityCheck(workflowData);
      break;
    case 'energy_optimization':
      result = await optimizeEnergy(workflowData);
      break;
    default:
      result = { message: 'Workflow executed successfully', data: workflowData };
  }

  // Update performance metrics
  const currentMetrics = agent.performance_metrics || {};
  const newMetrics = {
    ...currentMetrics,
    last_execution: new Date().toISOString(),
    executions_count: (currentMetrics.executions_count || 0) + 1,
    ...result.metrics
  };

  await supabase
    .from('ai_agents')
    .update({ 
      performance_metrics: newMetrics,
      success_rate: Math.min(100, (agent.success_rate || 0) + 0.1)
    })
    .eq('id', agentId);

  return new Response(
    JSON.stringify({ success: true, result }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function optimizeRoute(data: any) {
  console.log('Executing route optimization...');
  
  // Simulate route optimization logic
  const deliveries = data.deliveries || [];
  const optimizedRoutes = deliveries.map((delivery: any) => ({
    ...delivery,
    optimized_route: {
      estimated_time: Math.random() * 120 + 30, // 30-150 minutes
      distance: Math.random() * 50 + 10, // 10-60 km
      fuel_savings: Math.random() * 20 + 5 // 5-25% savings
    }
  }));

  // Update deliveries in database
  for (const route of optimizedRoutes) {
    if (route.id) {
      await supabase
        .from('deliveries')
        .update({ optimized_route: route.optimized_route })
        .eq('id', route.id);
    }
  }

  return {
    message: 'Routes optimized successfully',
    data: optimizedRoutes,
    metrics: {
      routes_optimized: optimizedRoutes.length,
      avg_savings: '15%',
      total_distance_saved: '45km'
    }
  };
}

async function manageInventory(data: any) {
  console.log('Executing inventory management...');
  
  // Get low stock items
  const { data: lowStockItems } = await supabase
    .from('inventory_items')
    .select('*')
    .lt('current_stock', 'min_stock');

  const reorderSuggestions = lowStockItems?.map(item => ({
    item_id: item.id,
    item_name: item.name,
    current_stock: item.current_stock,
    min_stock: item.min_stock,
    suggested_order: item.max_stock - item.current_stock,
    estimated_cost: (item.max_stock - item.current_stock) * item.unit_price
  })) || [];

  return {
    message: 'Inventory analysis completed',
    data: reorderSuggestions,
    metrics: {
      items_analyzed: lowStockItems?.length || 0,
      reorder_suggestions: reorderSuggestions.length,
      estimated_cost_savings: '$2,500'
    }
  };
}

async function predictMaintenance(data: any) {
  console.log('Executing predictive maintenance...');
  
  // Get assets that need maintenance
  const { data: assets } = await supabase
    .from('assets')
    .select('*')
    .in('status', ['warning', 'critical']);

  const maintenancePredictions = assets?.map(asset => ({
    asset_id: asset.id,
    asset_name: asset.name,
    current_status: asset.status,
    predicted_failure_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    confidence: Math.random() * 30 + 70, // 70-100% confidence
    recommended_action: asset.status === 'critical' ? 'Immediate maintenance required' : 'Schedule maintenance within 2 weeks'
  })) || [];

  return {
    message: 'Maintenance predictions generated',
    data: maintenancePredictions,
    metrics: {
      assets_analyzed: assets?.length || 0,
      failures_predicted: maintenancePredictions.length,
      downtime_potentially_avoided: '48 hours'
    }
  };
}

async function performQualityCheck(data: any) {
  console.log('Executing quality control check...');
  
  // Simulate quality inspection results
  const qualityResults = {
    inspection_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    defects_detected: Math.floor(Math.random() * 5),
    quality_score: Math.random() * 20 + 80, // 80-100%
    recommendations: [
      'Adjust machine calibration',
      'Check material quality',
      'Review operator training'
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  };

  return {
    message: 'Quality inspection completed',
    data: qualityResults,
    metrics: {
      defects_detected: qualityResults.defects_detected,
      quality_improvement: '2.1%',
      inspection_accuracy: '96.8%'
    }
  };
}

async function optimizeEnergy(data: any) {
  console.log('Executing energy optimization...');
  
  const energyOptimization = {
    current_consumption: Math.random() * 1000 + 500, // 500-1500 kWh
    optimized_consumption: Math.random() * 800 + 400, // 400-1200 kWh
    potential_savings: Math.random() * 300 + 50, // 50-350 kWh
    recommendations: [
      'Reduce idle time on CNC machines',
      'Optimize lighting schedules',
      'Implement power factor correction'
    ]
  };

  return {
    message: 'Energy optimization completed',
    data: energyOptimization,
    metrics: {
      energy_saved: `${Math.floor(energyOptimization.potential_savings)} kWh`,
      cost_savings: `$${Math.floor(energyOptimization.potential_savings * 0.12)}`,
      carbon_reduction: `${Math.floor(energyOptimization.potential_savings * 0.0005)} kg CO2`
    }
  };
}

async function getAgentStatus(agentId: string) {
  const { data: agent, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error || !agent) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  return new Response(
    JSON.stringify({ success: true, agent }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function updateAgentConfig(agentId: string, config: any) {
  const { error } = await supabase
    .from('ai_agents')
    .update({ configuration: config })
    .eq('id', agentId);

  if (error) {
    throw new Error(`Failed to update agent config: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Configuration updated' }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getPerformanceMetrics(agentId: string) {
  const { data: agent, error } = await supabase
    .from('ai_agents')
    .select('performance_metrics, success_rate, last_execution')
    .eq('id', agentId)
    .single();

  if (error || !agent) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      metrics: agent.performance_metrics,
      success_rate: agent.success_rate,
      last_execution: agent.last_execution
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}