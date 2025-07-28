import React from 'react';
import { OEEGauge } from '@/components/dashboard/OEEGauge';
import { ProductionCard } from '@/components/dashboard/ProductionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Zap, AlertTriangle, Clock } from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import heroImage from '@/assets/hero-industrial.jpg';

export default function PlantDirectorDashboard() {
  const { kpis, alerts } = useMockData();
  
  // Generate trend data for OEE gauge
  const oeeTrend = Array.from({ length: 24 }, (_, i) => 
    Math.max(70, Math.min(95, kpis.oee + (Math.random() - 0.5) * 10))
  );

  const criticalAlerts = alerts.filter(alert => alert.priority === 'critical');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground/90 text-sm mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              All systems operational
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Mission Control
              <span className="block text-primary-foreground/80 text-2xl md:text-3xl font-medium mt-2">
                Strategic Operations Dashboard
              </span>
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl">
              Real-time strategic overview with AI-powered insights for optimal plant performance and predictive maintenance
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 -mt-8 relative z-10">
        {/* Primary KPI Grid with Glass Effect */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* OEE Gauge with enhanced styling */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
            <OEEGauge value={kpis.oee} trend={oeeTrend} />
          </div>

          {/* Production Card with enhanced styling */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
            <ProductionCard 
              current={kpis.production.current}
              target={kpis.production.target}
              units={kpis.production.units}
            />
          </div>
        </div>

        {/* Enhanced Value Tracker Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Downtime Cost Avoided */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                Downtime Cost Avoided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                ${kpis.downtimeCostAvoided.toLocaleString()}
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                This month through AI-powered predictive maintenance
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                  +12% vs last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Energy Savings */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                Energy Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-2">
                ${kpis.energySavings.toLocaleString()}
              </div>
              <p className="text-amber-600 dark:text-amber-400 text-sm">
                This month through process optimization
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                  +8% efficiency gain
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Critical Alert Feed */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              Critical Alert Feed
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2 animate-pulse">
                  {criticalAlerts.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                  No critical alerts at this time
                </div>
                <p className="text-sm text-muted-foreground">
                  All systems operating within normal parameters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{alert.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span>Source: {alert.source}</span>
                        {alert.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {alert.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}