import { Injectable } from '@angular/core';
import { WidgetMeta } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class WidgetRegistryService {
  private readonly registry = new Map<string, WidgetMeta>();

  constructor() {
    this.registerDefaults();
  }

  register(meta: WidgetMeta): void {
    if (this.registry.has(meta.type)) {
      console.warn(`Widget type '${meta.type}' is already registered. Overwriting.`);
    }
    this.registry.set(meta.type, meta);
  }

  getMeta(type: string): WidgetMeta | undefined {
    return this.registry.get(type);
  }

  getAllWidgetMeta(): WidgetMeta[] {
    return Array.from(this.registry.values());
  }

  private registerDefaults(): void {
    this.register({
      type: 'kpi-strip',
      title: 'Platform Metrics',
      subtitle: 'Live Overview',
      icon: 'analytics',
      defaultSize: 'xl',
      // ARCH: Thunk — network fires only on first render, not at registration
      componentLoader: () => import('../widgets/kpi-strip/kpi-strip.component').then(m => m.KpiStripComponent)
    });

    this.register({
      type: 'analytics-chart',
      title: 'Monthly Recurring Revenue',
      subtitle: 'Trailing 30 days',
      icon: 'trending_up',
      defaultSize: 'lg',
      componentLoader: () => import('../widgets/analytics-chart/analytics-chart.component').then(m => m.AnalyticsChartComponent)
    });

    this.register({
      type: 'activity-feed',
      title: 'Recent Activity',
      subtitle: 'System & Users',
      icon: 'list_alt',
      defaultSize: 'sm',
      componentLoader: () => import('../widgets/activity-feed/activity-feed.component').then(m => m.ActivityFeedComponent)
    });

    this.register({
      type: 'task-board',
      title: 'Priority Tasks',
      subtitle: 'Needs Attention',
      icon: 'check_circle',
      defaultSize: 'lg',
      componentLoader: () => import('../widgets/task-board/task-board.component').then(m => m.TaskBoardComponent)
    });

    this.register({
      type: 'data-grid',
      title: 'Active Users',
      subtitle: 'Current Sessions',
      icon: 'groups',
      defaultSize: 'md',
      componentLoader: () => import('../widgets/data-grid/data-grid.component').then(m => m.DataGridComponent)
    });

    this.register({
      type: 'notifications',
      title: 'System Alerts',
      subtitle: 'Updates & Warnings',
      icon: 'notifications',
      defaultSize: 'sm',
      componentLoader: () => import('../widgets/notifications/notifications.component').then(m => m.NotificationsComponent)
    });

    this.register({
      type: 'team',
      title: 'Team Load',
      subtitle: 'Capacity Planning',
      icon: 'people',
      defaultSize: 'md',
      componentLoader: () => import('../widgets/team/team.component').then(m => m.TeamComponent)
    });

    this.register({
      type: 'settings',
      title: 'Quick Settings',
      subtitle: 'Dashboard Prefs',
      icon: 'settings',
      defaultSize: 'sm',
      componentLoader: () => import('../widgets/settings/settings.component').then(m => m.SettingsComponent)
    });
  }
}
