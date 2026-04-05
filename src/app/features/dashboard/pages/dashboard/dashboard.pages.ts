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
  template: `
    <div class="dashboard-toolbar">
      <h1 class="page-title">Operations Dashboard</h1>
      <div class="toolbar-actions">
        <button class="btn btn-primary" (click)="isEditMode.set(!isEditMode())">
          {{ isEditMode() ? 'Done' : 'Edit Dashboard' }}
        </button>
        <button class="btn btn-secondary" (click)="layoutService.resetToDefault()">Reset</button>
      </div>
    </div>

    <main class="canvas" [class.edit-mode]="isEditMode()">
      @if (isEditMode()) {
        <div class="edit-banner">Editing Mode Active</div>
      }

      <div class="grid" cdkDropListGroup>
        @for (row of gridRows(); track trackRow(row); let rIndex = $index) {
          <div class="grid-row" 
               cdkDropList 
               cdkDropListOrientation="horizontal" 
               [cdkDropListData]="rIndex"
               (cdkDropListDropped)="onDrop($event, rIndex)">
            
            @for (widget of row; track widget.id) {
              <div class="widget-cell widget-cell--{{widget.size}}" cdkDrag [cdkDragDisabled]="!isEditMode()">
                
                <div class="widget-placeholder" *cdkDragPlaceholder></div>
                
                @if (isEditMode()) {
                  <div class="edit-controls">
                    <div cdkDragHandle class="drag-handle">☰</div>
                    <button class="btn-remove" (click)="layoutService.removeWidget(widget.id)">Remove</button>
                    <select class="size-picker" [value]="widget.size" (change)="onSizeChange(widget.id, $event)">
                      <option value="sm">SM</option>
                      <option value="md">MD</option>
                      <option value="lg">LG</option>
                      <option value="xl">XL</option>
                    </select>
                  </div>
                }

                <div class="widget-header">
                  <span class="icon">
                    <lucide-icon [img]="getIcon(widget.icon)"></lucide-icon>
                  </span>
                  <div class="titles">
                    <div class="title">{{ widget.title }}</div>
                    <div class="subtitle">{{ widget.subtitle }}</div>
                  </div>
                </div>
                
                <ng-container [hgWidgetHost]="widget"></ng-container>
                
              </div>
            }
          </div>
        }
      </div>

      @if (isEditMode()) {
        <div class="add-panel">
          <h3>Add Widget</h3>
          <div class="add-buttons">
            <button class="btn" (click)="addWidget('analytics-chart')">+ Chart</button>
            <button class="btn" (click)="addWidget('data-grid')">+ Grid</button>
            <button class="btn" (click)="addWidget('kpi-strip')">+ KPIs</button>
            <button class="btn" (click)="addWidget('task-board')">+ Tasks</button>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dashboard-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px 0;
      flex-wrap: wrap;
      
      .dashboard-ticker {
        width: 100%;
        margin-bottom: 16px;
        border-radius: 8px;
      }
      
      .page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--on-surface, #131b2e);
        letter-spacing: -0.01em;
      }

      .toolbar-actions {
        display: flex;
        gap: 12px;
      }
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      
      &-primary {
        background: var(--primary-container, #131b2e);
        color: var(--tertiary-fixed, #fff);
      }
      
      &-secondary {
        background: var(--surface-container, #eceef0);
        color: var(--on-surface, #131b2e);
      }
      
      &-remove {
        background: transparent;
        color: #ff6b6b;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .canvas {
      padding-top: 16px;
      min-height: calc(100vh - 120px);
      padding-bottom: 60px;
    }

    .edit-banner {
      background: rgba(111,251,190,0.2);
      color: #0b5e36;
      padding: 10px 20px;
      margin: 0 20px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-align: center;
    }

    .grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 0 20px;
    }

    .grid-row {
      display: flex;
      gap: 20px;
      min-height: 100px;
    }

    .widget-cell {
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(19,27,46,0.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      &--sm { flex: 1; }
      &--md { flex: 2; }
      &--lg { flex: 3; }
      &--xl { flex: 4; }
    }

    /* ARCH: Exception: *cdkDragPlaceholder stays as structural directive */
    .widget-placeholder {
      border: 1.5px dashed rgba(111,251,190,0.35);
      background: rgba(111,251,190,0.10);
      border-radius: 10px;
      flex: 1;
      min-height: 150px;
    }

    ::ng-deep .cdk-drag-preview {
      border-radius: 10px;
      box-shadow: 0 24px 60px rgba(19,27,46,0.16) !important;
      opacity: 0.9;
      background: #ffffff;
    }

    ::ng-deep .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    ::ng-deep .grid-row.cdk-drop-list-dragging .widget-cell:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .edit-controls {
      padding: 8px 16px;
      background: #eceef0;
      display: flex;
      gap: 12px;
      align-items: center;
      
      .drag-handle {
        cursor: grab;
        color: #9ca3af;
        &:active { cursor: grabbing; }
      }
      
      .size-picker {
        border: none;
        background: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .widget-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      
      .icon {
        font-family: sans-serif;
        color: #131b2e;
        opacity: 0.7;
      }
      
      .titles {
        display: flex;
        flex-direction: column;
        
        .title {
          font-size: 14px;
          font-weight: 600;
          color: #131b2e;
        }
        
        .subtitle {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .add-panel {
      margin: 40px 20px;
      padding: 24px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(19,27,46,0.06);
      
      h3 {
        margin: 0 0 16px 0;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
      }
      
      .add-buttons {
        display: flex;
        gap: 12px;
      }
    }
  `]
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
