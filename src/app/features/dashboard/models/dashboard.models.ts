// ARCH: Union type not enum — zero runtime cost
export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl';

export const WIDGET_SIZE_FLEX: Record<WidgetSize, number> = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  icon: string;
  size: WidgetSize;
  badge?: string;
  meta?: unknown;
}

export interface DashboardLayout {
  version: number;
  rows: WidgetConfig[][];
}

export interface WidgetMeta {
  type: string;
  title: string;
  subtitle: string;
  icon: string;
  defaultSize: WidgetSize;
  // ARCH: Thunk — network fires only on first render, not at registration
  componentLoader: () => Promise<unknown>;
}

export const DEFAULT_LAYOUT: DashboardLayout = {
  version: 1,
  rows: [
    [
      {
        id: 'kpi-1',
        type: 'kpi-strip',
        title: 'Platform Metrics',
        subtitle: 'Live Overview',
        icon: 'analytics',
        size: 'xl'
      }
    ],
    [
      {
        id: 'chart-1',
        type: 'analytics-chart',
        title: 'Monthly Recurring Revenue',
        subtitle: 'Trailing 30 days',
        icon: 'trending_up',
        size: 'lg'
      },
      {
        id: 'activity-1',
        type: 'activity-feed',
        title: 'Recent Activity',
        subtitle: 'System & Users',
        icon: 'list_alt',
        size: 'sm'
      }
    ],
    [
      {
        id: 'grid-1',
        type: 'data-grid',
        title: 'Active Users',
        subtitle: 'Current Sessions',
        icon: 'groups',
        size: 'md'
      },
      {
        id: 'tasks-1',
        type: 'task-board',
        title: 'Priority Tasks',
        subtitle: 'Needs Attention',
        icon: 'check_circle',
        size: 'lg'
      }
    ]
  ]
};
