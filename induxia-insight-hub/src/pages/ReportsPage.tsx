import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';

const mockReports = [
  { id: 'RPT-001', title: 'Monthly OEE Report', type: 'Performance', date: '2024-01-28', size: '2.4 MB', status: 'ready' },
  { id: 'RPT-002', title: 'Maintenance Cost Analysis', type: 'Financial', date: '2024-01-27', size: '1.8 MB', status: 'ready' },
  { id: 'RPT-003', title: 'Quality Trends Report', type: 'Quality', date: '2024-01-26', size: '3.1 MB', status: 'ready' },
  { id: 'RPT-004', title: 'Energy Consumption Analysis', type: 'Operational', date: '2024-01-25', size: '1.5 MB', status: 'ready' },
];

const mockKPIs = {
  oeeImprovement: '+12%',
  costSavings: '$67,000',
  qualityImprovement: '+3.2%',
  energyReduction: '-8%',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Access detailed reports and performance analytics</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{mockKPIs.oeeImprovement}</div>
                <div className="text-sm text-muted-foreground">OEE Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{mockKPIs.costSavings}</div>
                <div className="text-sm text-muted-foreground">Cost Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{mockKPIs.qualityImprovement}</div>
                <div className="text-sm text-muted-foreground">Quality Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{mockKPIs.energyReduction}</div>
                <div className="text-sm text-muted-foreground">Energy Reduction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Available Reports
            </CardTitle>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockReports.map((report) => (
              <Card key={report.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.type}</p>
                    </div>
                    <Badge variant="success">Ready</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {report.date}
                    </div>
                    <span>{report.size}</span>
                  </div>

                  <Button size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}