import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Download,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { format } from 'date-fns';

interface SearchFilters {
  query: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  severity: string[];
  status: string[];
  lineId: string[];
  confidence: {
    min: number;
    max: number;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onExport: (filters: SearchFilters) => void;
  productionLines: Array<{ id: string; name: string; }>;
  className?: string;
}

const severityOptions = [
  { value: 'minor', label: 'Minor' },
  { value: 'major', label: 'Major' },
  { value: 'critical', label: 'Critical' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
];

const sortOptions = [
  { value: 'timestamp', label: 'Date/Time' },
  { value: 'severity', label: 'Severity' },
  { value: 'confidence', label: 'Confidence' },
  { value: 'defectType', label: 'Defect Type' },
];

export function AdvancedSearch({ onSearch, onExport, productionLines, className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: { from: null, to: null },
    severity: [],
    status: [],
    lineId: [],
    confidence: { min: 0, max: 100 },
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleExport = () => {
    onExport(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      dateRange: { from: null, to: null },
      severity: [],
      status: [],
      lineId: [],
      confidence: { min: 0, max: 100 },
      sortBy: 'timestamp',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'severity' | 'status' | 'lineId', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.severity.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.lineId.length > 0) count++;
    if (filters.confidence.min > 0 || filters.confidence.max < 100) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Search & Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search incidents, defect types, actions..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {filters.dateRange.from ? format(filters.dateRange.from, 'PPP') : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from || undefined}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {filters.dateRange.to ? format(filters.dateRange.to, 'PPP') : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to || undefined}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <div className="flex gap-2 flex-wrap">
                {severityOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${option.value}`}
                      checked={filters.severity.includes(option.value)}
                      onCheckedChange={() => toggleArrayFilter('severity', option.value)}
                    />
                    <label htmlFor={`severity-${option.value}`} className="text-sm">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={() => toggleArrayFilter('status', option.value)}
                    />
                    <label htmlFor={`status-${option.value}`} className="text-sm">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Line Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Production Lines</label>
              <div className="flex gap-2 flex-wrap">
                {productionLines.map(line => (
                  <div key={line.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`line-${line.id}`}
                      checked={filters.lineId.includes(line.id)}
                      onCheckedChange={() => toggleArrayFilter('lineId', line.id)}
                    />
                    <label htmlFor={`line-${line.id}`} className="text-sm">
                      {line.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                AI Confidence Range: {filters.confidence.min}% - {filters.confidence.max}%
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min %"
                  value={filters.confidence.min}
                  onChange={(e) => updateFilter('confidence', { ...filters.confidence, min: parseInt(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max %"
                  value={filters.confidence.max}
                  onChange={(e) => updateFilter('confidence', { ...filters.confidence, max: parseInt(e.target.value) || 100 })}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button onClick={handleReset} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}