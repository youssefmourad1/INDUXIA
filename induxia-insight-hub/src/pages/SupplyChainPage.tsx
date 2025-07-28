import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Package, AlertTriangle, CheckCircle, Clock, TrendingUp, Building, BarChart3, Map, Bot, Navigation, Zap, Route, MapPin, Timer, Brain, Target, RefreshCw, Key, Info, Factory, Home } from 'lucide-react';

// Enhanced mockup data with real coordinates
const mockSupplyData = {
  inventory: [{
    id: 'INV-001',
    name: 'Steel Bearings',
    current: 245,
    minimum: 100,
    maximum: 500,
    unit: 'units',
    status: 'adequate',
    warehouse: 'Warehouse A'
  }, {
    id: 'INV-002',
    name: 'Hydraulic Oil',
    current: 15,
    minimum: 50,
    maximum: 200,
    unit: 'liters',
    status: 'critical',
    warehouse: 'Warehouse B'
  }, {
    id: 'INV-003',
    name: 'Control Sensors',
    current: 85,
    minimum: 30,
    maximum: 150,
    unit: 'units',
    status: 'adequate',
    warehouse: 'Warehouse A'
  }, {
    id: 'INV-004',
    name: 'Drive Belts',
    current: 25,
    minimum: 40,
    maximum: 120,
    unit: 'units',
    status: 'low',
    warehouse: 'Warehouse C'
  }, {
    id: 'INV-005',
    name: 'Electrical Components',
    current: 180,
    minimum: 50,
    maximum: 250,
    unit: 'units',
    status: 'adequate',
    warehouse: 'Warehouse B'
  }],
  suppliers: [{
    id: 'SUP-001',
    name: 'Industrial Solutions Inc',
    performance: 94,
    deliveryTime: 2.1,
    qualityScore: 96,
    status: 'excellent',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'New York, NY'
    },
    distance: 120,
    aiOptimizedRoute: true
  }, {
    id: 'SUP-002',
    name: 'MechParts Ltd',
    performance: 78,
    deliveryTime: 4.2,
    qualityScore: 82,
    status: 'warning',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: 'Chicago, IL'
    },
    distance: 250,
    aiOptimizedRoute: false
  }, {
    id: 'SUP-003',
    name: 'TechSupply Corp',
    performance: 91,
    deliveryTime: 1.8,
    qualityScore: 94,
    status: 'excellent',
    location: {
      lat: 39.7392,
      lng: -104.9903,
      address: 'Denver, CO'
    },
    distance: 180,
    aiOptimizedRoute: true
  }],
  deliveries: [{
    id: 'DEL-001',
    supplier: 'Industrial Solutions Inc',
    item: 'Steel Bearings',
    expected: '2024-01-29',
    status: 'on-time',
    route: 'Optimized Route A',
    estimatedArrival: '14:30',
    currentLocation: {
      lat: 40.5,
      lng: -74.2
    },
    aiAgent: 'RouteBot-Alpha'
  }, {
    id: 'DEL-002',
    supplier: 'MechParts Ltd',
    item: 'Hydraulic Oil',
    expected: '2024-01-30',
    status: 'delayed',
    route: 'Standard Route B',
    estimatedArrival: '16:45',
    currentLocation: {
      lat: 41.2,
      lng: -87.8
    },
    aiAgent: 'LogiBot-Beta'
  }, {
    id: 'DEL-003',
    supplier: 'TechSupply Corp',
    item: 'Control Sensors',
    expected: '2024-01-29',
    status: 'in-transit',
    route: 'AI Optimized Route C',
    estimatedArrival: '12:15',
    currentLocation: {
      lat: 39.9,
      lng: -105.1
    },
    aiAgent: 'RouteBot-Gamma'
  }],
  aiAgents: [{
    id: 'AGENT-001',
    name: 'RouteBot-Alpha',
    type: 'Route Optimization',
    status: 'active',
    efficiency: 97,
    tasksCompleted: 234,
    currentTask: 'Optimizing delivery route for Steel Bearings',
    capabilities: ['Real-time traffic analysis', 'Weather impact assessment', 'Fuel optimization'],
    lastAction: 'Rerouted DEL-001 to avoid traffic jam, saving 23 minutes'
  }, {
    id: 'AGENT-002',
    name: 'InventoryBot-Prime',
    type: 'Inventory Management',
    status: 'active',
    efficiency: 92,
    tasksCompleted: 156,
    currentTask: 'Monitoring hydraulic oil levels - auto-ordering triggered',
    capabilities: ['Predictive restocking', 'Demand forecasting', 'Supplier selection'],
    lastAction: 'Automatically ordered 150L of hydraulic oil from best supplier'
  }, {
    id: 'AGENT-003',
    name: 'LogiBot-Beta',
    type: 'Logistics Coordination',
    status: 'active',
    efficiency: 89,
    tasksCompleted: 89,
    currentTask: 'Coordinating multi-supplier delivery consolidation',
    capabilities: ['Load optimization', 'Warehouse allocation', 'Cost minimization'],
    lastAction: 'Consolidated 3 deliveries into single route, saving $340'
  }],
  warehouseLocations: [{
    id: 'WH-A',
    name: 'Warehouse A',
    lat: 40.7589,
    lng: -73.9851,
    capacity: 85,
    inventory: ['Steel Bearings', 'Control Sensors']
  }, {
    id: 'WH-B',
    name: 'Warehouse B',
    lat: 40.7505,
    lng: -73.9934,
    capacity: 62,
    inventory: ['Hydraulic Oil', 'Electrical Components']
  }, {
    id: 'WH-C',
    name: 'Warehouse C',
    lat: 40.7282,
    lng: -73.7949,
    capacity: 78,
    inventory: ['Drive Belts']
  }],
  plantLocation: {
    lat: 40.7480,
    lng: -73.9857,
    name: 'INDUXIA Manufacturing Plant'
  } // Central plant location
};

// Custom SVG-based supply chain map component
const CustomSupplyChainMap = ({
  deliveries,
  warehouses,
  suppliers,
  plantLocation
}: any) => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Define positions for our schematic map (normalized 0-1 coordinates)
  const positions = {
    plant: {
      x: 0.5,
      y: 0.5
    },
    warehouses: [{
      x: 0.3,
      y: 0.3
    }, {
      x: 0.7,
      y: 0.3
    }, {
      x: 0.5,
      y: 0.7
    }],
    suppliers: [{
      x: 0.1,
      y: 0.2
    }, {
      x: 0.9,
      y: 0.2
    }, {
      x: 0.1,
      y: 0.8
    }],
    deliveries: [{
      x: 0.2,
      y: 0.4
    }, {
      x: 0.8,
      y: 0.6
    }, {
      x: 0.4,
      y: 0.2
    }]
  };
  const mapWidth = 600;
  const mapHeight = 400;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return '#10b981';
      case 'delayed':
        return '#ef4444';
      case 'in-transit':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };
  const handleElementClick = (elementType: string, elementId: string) => {
    if (elementType === 'delivery') {
      setSelectedDelivery(elementId);
    }
  };
  return <div className="relative h-96 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-lg border overflow-hidden">
      {/* Map Header */}
      

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-blue-500" />
            <span>Plant</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-3 h-3 text-green-500" />
            <span>Warehouses</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3 text-purple-500" />
            <span>Suppliers</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3 h-3 text-orange-500" />
            <span>Deliveries</span>
          </div>
        </div>
      </div>

      {/* Main SVG Map */}
      <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="absolute inset-0">
        {/* Background grid pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
          </pattern>
          
          {/* Gradient definitions */}
          <radialGradient id="plantGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
          </radialGradient>
          
          <radialGradient id="warehouseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="1" />
          </radialGradient>
          
          <radialGradient id="supplierGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
          </radialGradient>
          
          {/* Animated elements */}
          <animateTransform id="pulse" attributeName="transform" attributeType="XML" type="scale" values="1;1.1;1" dur="2s" repeatCount="indefinite" />
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Route lines from suppliers to plant */}
        {suppliers.map((supplier: any, index: number) => {
        const supplierPos = positions.suppliers[index];
        const plantPos = positions.plant;
        const isAiOptimized = supplier.aiOptimizedRoute;
        return <g key={`route-${supplier.id}`}>
              <path d={`M ${supplierPos.x * mapWidth} ${supplierPos.y * mapHeight} 
                   Q ${(supplierPos.x + plantPos.x) * mapWidth / 2} ${(supplierPos.y + plantPos.y) * mapHeight / 2 - 30}
                   ${plantPos.x * mapWidth} ${plantPos.y * mapHeight}`} stroke={isAiOptimized ? '#8b5cf6' : '#6b7280'} strokeWidth={isAiOptimized ? '3' : '2'} strokeDasharray={isAiOptimized ? '0' : '8,4'} fill="none" opacity="0.6" className={isAiOptimized ? 'animate-pulse' : ''} />
              
              {/* AI optimization indicator */}
              {isAiOptimized && <circle cx={(supplierPos.x + plantPos.x) * mapWidth / 2} cy={(supplierPos.y + plantPos.y) * mapHeight / 2 - 30} r="3" fill="#8b5cf6" className="animate-pulse" />}
            </g>;
      })}

        {/* Warehouse connections to plant */}
        {warehouses.map((warehouse: any, index: number) => {
        const warehousePos = positions.warehouses[index];
        const plantPos = positions.plant;
        return <line key={`warehouse-line-${warehouse.id}`} x1={warehousePos.x * mapWidth} y1={warehousePos.y * mapHeight} x2={plantPos.x * mapWidth} y2={plantPos.y * mapHeight} stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" opacity="0.4" />;
      })}

        {/* Plant (main facility) */}
        <g transform={`translate(${positions.plant.x * mapWidth}, ${positions.plant.y * mapHeight})`}>
          <circle r="20" fill="url(#plantGradient)" stroke="white" strokeWidth="3" className="drop-shadow-lg cursor-pointer" onMouseEnter={() => setHoveredElement('plant')} onMouseLeave={() => setHoveredElement(null)}>
            <animateTransform attributeName="transform" attributeType="XML" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <text y="35" textAnchor="middle" className="text-xs font-medium fill-blue-700 dark:fill-blue-300">
            {plantLocation.name}
          </text>
        </g>

        {/* Warehouses */}
        {warehouses.map((warehouse: any, index: number) => {
        const pos = positions.warehouses[index];
        return <g key={warehouse.id} transform={`translate(${pos.x * mapWidth}, ${pos.y * mapHeight})`}>
              <circle r="12" fill="url(#warehouseGradient)" stroke="white" strokeWidth="2" className="drop-shadow-md cursor-pointer" onMouseEnter={() => setHoveredElement(warehouse.id)} onMouseLeave={() => setHoveredElement(null)}>
                <animateTransform attributeName="transform" attributeType="XML" type="scale" values="1;1.1;1" dur="4s" repeatCount="indefinite" />
              </circle>
              <text y="25" textAnchor="middle" className="text-xs font-medium fill-green-700 dark:fill-green-300">
                {warehouse.name}
              </text>
              <text y="35" textAnchor="middle" className="text-xs fill-green-600 dark:fill-green-400">
                {warehouse.capacity}%
              </text>
            </g>;
      })}

        {/* Suppliers */}
        {suppliers.map((supplier: any, index: number) => {
        const pos = positions.suppliers[index];
        return <g key={supplier.id} transform={`translate(${pos.x * mapWidth}, ${pos.y * mapHeight})`}>
              <circle r="10" fill={supplier.aiOptimized ? "url(#supplierGradient)" : "#6b7280"} stroke="white" strokeWidth="2" className="drop-shadow-md cursor-pointer" onMouseEnter={() => setHoveredElement(supplier.id)} onMouseLeave={() => setHoveredElement(null)} />
              <text y="22" textAnchor="middle" className="text-xs font-medium fill-purple-700 dark:fill-purple-300">
                {supplier.name.split(' ')[0]}
              </text>
              {supplier.aiOptimizedRoute && <circle r="15" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2,2" className="animate-spin" style={{
            animationDuration: '8s'
          }} />}
            </g>;
      })}

        {/* Delivery vehicles */}
        {deliveries.map((delivery: any, index: number) => {
        const pos = positions.deliveries[index];
        const statusColor = getStatusColor(delivery.status);
        return <g key={delivery.id} transform={`translate(${pos.x * mapWidth}, ${pos.y * mapHeight})`} className="cursor-pointer" onClick={() => handleElementClick('delivery', delivery.id)}>
              <circle r="8" fill={statusColor} stroke="white" strokeWidth="2" className="drop-shadow-md" onMouseEnter={() => setHoveredElement(delivery.id)} onMouseLeave={() => setHoveredElement(null)}>
                <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0; 0,-2; 0,0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Delivery trail effect */}
              <circle r="12" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.3" className="animate-ping" />
              
              <text y="20" textAnchor="middle" className="text-xs font-medium" fill={statusColor}>
                {delivery.item.split(' ')[0]}
              </text>
            </g>;
      })}

        {/* Hover tooltips */}
        {hoveredElement && <foreignObject x="10" y="10" width="200" height="100">
            <div className="bg-black/80 text-white text-xs p-2 rounded shadow-lg">
              {hoveredElement === 'plant' && <div>
                  <div className="font-semibold">{plantLocation.name}</div>
                  <div>Main Manufacturing Facility</div>
                </div>}
              {warehouses.find((w: any) => w.id === hoveredElement) && <div>
                  <div className="font-semibold">
                    {warehouses.find((w: any) => w.id === hoveredElement)?.name}
                  </div>
                  <div>Capacity: {warehouses.find((w: any) => w.id === hoveredElement)?.capacity}%</div>
                </div>}
              {suppliers.find((s: any) => s.id === hoveredElement) && <div>
                  <div className="font-semibold">
                    {suppliers.find((s: any) => s.id === hoveredElement)?.name}
                  </div>
                  <div>Performance: {suppliers.find((s: any) => s.id === hoveredElement)?.performance}%</div>
                </div>}
              {deliveries.find((d: any) => d.id === hoveredElement) && <div>
                  <div className="font-semibold">
                    {deliveries.find((d: any) => d.id === hoveredElement)?.item}
                  </div>
                  <div>ETA: {deliveries.find((d: any) => d.id === hoveredElement)?.estimatedArrival}</div>
                  <div>Status: {deliveries.find((d: any) => d.id === hoveredElement)?.status}</div>
                </div>}
            </div>
          </foreignObject>}
      </svg>

      {/* Selected delivery info panel */}
      {selectedDelivery && <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">
                {deliveries.find((d: any) => d.id === selectedDelivery)?.item}
              </h4>
              <p className="text-sm text-muted-foreground">
                {deliveries.find((d: any) => d.id === selectedDelivery)?.supplier}
              </p>
              <div className="flex gap-4 mt-2 text-xs">
                <span>Route: {deliveries.find((d: any) => d.id === selectedDelivery)?.route}</span>
                <span>ETA: {deliveries.find((d: any) => d.id === selectedDelivery)?.estimatedArrival}</span>
                <span>AI Agent: {deliveries.find((d: any) => d.id === selectedDelivery)?.aiAgent}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setSelectedDelivery(null)}>
              ×
            </Button>
          </div>
        </div>}
    </div>;
};
const AIAgentCard = ({
  agent
}: {
  agent: any;
}) => <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">{agent.name}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">{agent.type}</div>
        </div>
        <div className="ml-auto">
          <Badge className={`${agent.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {agent.status}
          </Badge>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Efficiency</span>
          <span className="font-medium">{agent.efficiency}%</span>
        </div>
        <Progress value={agent.efficiency} className="h-1.5" />
      </div>
      
      <div className="text-xs">
        <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">Current Task:</div>
        <div className="text-purple-600 dark:text-purple-400">{agent.currentTask}</div>
      </div>
      
      <div className="text-xs">
        <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">Last Action:</div>
        <div className="text-green-600 dark:text-green-400">{agent.lastAction}</div>
      </div>
      
      <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400">
        <span>Tasks Completed: {agent.tasksCompleted}</span>
        <div className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          <span>AI Active</span>
        </div>
      </div>
    </CardContent>
  </Card>;
export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // Simulate AI agent activity
      console.log('AI agents updating routes and inventory...');
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 border-b border-border/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                AI-Powered Supply Chain
                <span className="block text-xl md:text-2xl font-medium text-muted-foreground mt-1">
                  Intelligent Logistics & Route Optimization
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Real-time inventory management with AI agents optimizing routes like Waze for your supply chain
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">AI Agents Active</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {mockSupplyData.deliveries.filter(d => d.status === 'on-time').length}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">On-Time Deliveries</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">97%</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Route Efficiency</div>
                    </div>
                    <Route className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">3</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">AI Agents Active</div>
                    </div>
                    <Bot className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {mockSupplyData.inventory.filter(i => i.status === 'critical' || i.status === 'low').length}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Items Need Restocking</div>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Inventory Status */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    Smart Inventory Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSupplyData.inventory.map(item => {
                  const percentage = item.current / item.maximum * 100;
                  const isLow = item.current <= item.minimum;
                  const isCritical = item.status === 'critical';
                  return <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <div className="text-xs text-muted-foreground">{item.warehouse}</div>
                          </div>
                          <Badge variant={isCritical ? 'destructive' : isLow ? 'warning' : 'success'}>
                            {item.current} {item.unit}
                          </Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Min: {item.minimum} | Max: {item.maximum}</span>
                          {(isLow || isCritical) && <span className="text-blue-600 flex items-center gap-1">
                              <Bot className="w-3 h-3" />
                              AI auto-ordering
                            </span>}
                        </div>
                      </div>;
                })}
                </CardContent>
              </Card>

              {/* Enhanced Supplier Performance */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    AI-Optimized Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSupplyData.suppliers.map(supplier => <div key={supplier.id} className="p-3 border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{supplier.name}</div>
                        <div className="flex items-center gap-1">
                          {supplier.aiOptimizedRoute && <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              AI Optimized
                            </Badge>}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Performance:</span>
                          <span className="font-medium">{supplier.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span>{supplier.distance} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Delivery:</span>
                          <span>{supplier.deliveryTime} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality Score:</span>
                          <span>{supplier.qualityScore}%</span>
                        </div>
                      </div>
                    </div>)}
                </CardContent>
              </Card>

              {/* Enhanced Delivery Tracking */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    Live Delivery Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSupplyData.deliveries.map(delivery => <div key={delivery.id} className="p-3 border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{delivery.item}</div>
                          <div className="text-sm text-muted-foreground">{delivery.supplier}</div>
                        </div>
                        <Badge variant={delivery.status === 'delayed' ? 'destructive' : delivery.status === 'on-time' ? 'success' : 'default'}>
                          {delivery.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Route:</span>
                          <span className="text-blue-600">{delivery.route}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ETA:</span>
                          <span className="font-medium">{delivery.estimatedArrival}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Agent:</span>
                          <span className="text-purple-600">{delivery.aiAgent}</span>
                        </div>
                      </div>
                    </div>)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-primary" />
                      Interactive Supply Chain Network
                      <Badge className="ml-auto">
                        <Timer className="w-3 h-3 mr-1" />
                        Live Updates
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomSupplyChainMap deliveries={mockSupplyData.deliveries} warehouses={mockSupplyData.warehouseLocations} suppliers={mockSupplyData.suppliers} plantLocation={mockSupplyData.plantLocation} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Route Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">Best Route Found</span>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        AI reduced delivery time by 23 minutes using real-time traffic data
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fuel Savings:</span>
                        <span className="font-medium text-green-600">$340/week</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Saved:</span>
                        <span className="font-medium text-blue-600">2.3 hours/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CO₂ Reduced:</span>
                        <span className="font-medium text-emerald-600">45 kg/week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Warehouse Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockSupplyData.warehouseLocations.map(warehouse => <div key={warehouse.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm">{warehouse.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {warehouse.inventory.length} item types
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{warehouse.capacity}%</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                      </div>)}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockSupplyData.aiAgents.map(agent => <AIAgentCard key={agent.id} agent={agent} />)}
            </div>

            {/* AI Performance Dashboard */}
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Brain className="w-5 h-5" />
                  AI Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">479</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400">Total Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">$2,340</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400">Cost Savings This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">99.2%</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Delivery Accuracy</span>
                      <span className="font-bold text-green-600">97.8%</span>
                    </div>
                    <Progress value={97.8} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Route Efficiency</span>
                      <span className="font-bold text-blue-600">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Cost Optimization</span>
                      <span className="font-bold text-purple-600">89.5%</span>
                    </div>
                    <Progress value={89.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-sm text-green-600 dark:text-green-400">Total Savings</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">$12,450</div>
                      <div className="text-xs text-green-600 dark:text-green-400">This month</div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fuel Optimization:</span>
                        <span className="font-medium">$4,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route Efficiency:</span>
                        <span className="font-medium">$3,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inventory Management:</span>
                        <span className="font-medium">$2,950</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Automation:</span>
                        <span className="font-medium">$1,500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}