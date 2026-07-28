import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { WidgetHostDirective } from '../../../../shared/directives/widget-host.directive';
import { WidgetConfig, WidgetSize } from '../../models/dashboard.models';
import { LucideAngularModule, Activity, TrendingUp, List, Users, CheckCircle, PlusSquare } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, WidgetHostDirective, LucideAngularModule],
  templateUrl: './dashboard.pages.html',
  styleUrl: './dashboard.pages.scss'
})
export class DashboardComponent implements OnInit {
  readonly layoutService = inject(DashboardLayoutService);

  readonly isEditMode = signal(false);

  readonly gridRows = computed(() => this.layoutService.layout().rows);

  private readonly iconMap: Record<string, any> = {
    'analytics': Activity,
    'trending_up': TrendingUp,
    'list_alt': List,
    'groups': Users,
    'check_circle': CheckCircle,
    'add_box': PlusSquare
  };

  getIcon(iconStr: string): any {
    return this.iconMap[iconStr] || Activity;
  }

  ngOnInit(): void {
    this.layoutService.loadFromStorage();
  }

  // ARCH: trackRow — prevents full row re-render on every signal update
  trackRow(row: WidgetConfig[]): string {
    return row.map(w => w.id).join('-');
  }

  onDrop(event: CdkDragDrop<number>, destRowIndex: number): void {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }
    const sourceRowIndex = event.previousContainer.data;
    this.layoutService.moveWidget(sourceRowIndex, destRowIndex, event.previousIndex, event.currentIndex);
  }

  onSizeChange(id: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.layoutService.resizeWidget(id, select.value as WidgetSize);
  }

  addWidget(type: string): void {
    const newWidget: WidgetConfig = {
      id: `${type}-${Date.now()}`,
      type,
      title: 'New Widget',
      subtitle: 'Configured',
      icon: 'add_box',
      size: 'md'
    };
    this.layoutService.addWidget(newWidget);
  }
}
