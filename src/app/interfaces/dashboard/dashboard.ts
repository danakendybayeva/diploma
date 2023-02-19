import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexYAxis,
  ApexXAxis,
  ChartComponent,
  ApexDataLabels,
  ApexGrid,
  ApexTitleSubtitle
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    }
  } | string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
  dataLabels?: any;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}
export interface ChartOptionsWeek {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  fill: ApexFill;
  tooltip: ApexTooltip;
}

export interface ApexXAxis2 {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    }
  };
}

export interface ChartOptionColumns {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis2;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
}

export interface ChartLineOptions  {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
}
