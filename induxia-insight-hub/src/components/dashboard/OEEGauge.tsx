import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OEEGaugeProps {
  value: number;
  trend?: number[];
}

export function OEEGauge({ value, trend = [] }: OEEGaugeProps) {
  const getOEEColor = (oee: number) => {
    if (oee >= 85) return 'text-status-healthy';
    if (oee >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getOEEBackground = (oee: number) => {
    if (oee >= 85) return 'from-success/20 to-success/5';
    if (oee >= 70) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  // Calculate angle for the gauge (180 degrees total)
  const angle = (value / 100) * 180;
  const rotation = angle - 90; // Adjust for starting position

  return (
    <Card className={`transition-all duration-300 shadow-industrial bg-gradient-to-br ${getOEEBackground(value)}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Overall Equipment Effectiveness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge */}
        <div className="relative w-48 h-24 mx-auto">
          {/* Background arc */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke={`hsl(var(--${value >= 85 ? 'success' : value >= 70 ? 'warning' : 'destructive'}))`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(value / 100) * 251.2} 251.2`}
              className="transition-all duration-1000 ease-out"
            />
            {/* Needle */}
            <g transform={`translate(100,80) rotate(${rotation})`}>
              <line
                x1="0"
                y1="0"
                x2="60"
                y2="0"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="hsl(var(--foreground))"
              />
            </g>
          </svg>
          
          {/* Value display */}
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getOEEColor(value)}`}>
                {value.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">OEE</div>
            </div>
          </div>
        </div>

        {/* Trend sparkline */}
        {trend.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">24h Trend</div>
            <div className="h-8 flex items-end space-x-1">
              {trend.map((point, index) => (
                <div
                  key={index}
                  className="bg-primary/60 rounded-sm flex-1"
                  style={{ height: `${(point / 100) * 32}px` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-status-healthy font-semibold">≥85%</div>
            <div className="text-muted-foreground">Excellent</div>
          </div>
          <div className="text-center">
            <div className="text-warning font-semibold">70-84%</div>
            <div className="text-muted-foreground">Good</div>
          </div>
          <div className="text-center">
            <div className="text-destructive font-semibold">&lt;70%</div>
            <div className="text-muted-foreground">Needs Action</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}