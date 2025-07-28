import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target } from 'lucide-react';

interface ProductionCardProps {
  current: number;
  target: number;
  units: string;
}

export function ProductionCard({ current, target, units }: ProductionCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOnTrack = percentage >= 80;
  const remaining = Math.max(target - current, 0);

  return (
    <Card className="shadow-industrial transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Production vs Target
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {current.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Produced Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {target.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Daily Target</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className={`font-semibold ${isOnTrack ? 'text-success' : 'text-warning'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={percentage} 
            className="h-3"
          />
        </div>

        {/* Status and remaining */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isOnTrack ? 'text-success' : 'text-warning'}`} />
            <span className={`text-sm font-medium ${isOnTrack ? 'text-success' : 'text-warning'}`}>
              {isOnTrack ? 'On Track' : 'Behind Target'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              {remaining.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">{units} Remaining</div>
          </div>
        </div>

        {/* Time-based projection */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Completion</span>
            <span className="text-sm font-medium">
              {percentage >= 100 ? 'Target Achieved!' : '18:30 Today'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}