import { Injectable, computed, signal } from '@angular/core';
import { DashboardLayout, DEFAULT_LAYOUT, WidgetConfig, WidgetSize } from '../models/dashboard.models';

const STORAGE_KEY = 'hg_dashboard_layout';

@Injectable({
  providedIn: 'root'
})
export class DashboardLayoutService {
  private readonly _layout = signal<DashboardLayout>(structuredClone(DEFAULT_LAYOUT));
  
  // ARCH: asReadonly() — enforces unidirectional flow at the type level
  readonly layout = this._layout.asReadonly();
  
  readonly activeTypes = computed(() => {
    const types = new Set<string>();
    for (const row of this.layout().rows) {
      for (const widget of row) {
        types.add(widget.type);
      }
    }
    return Array.from(types);
  });

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardLayout;
        if (parsed.version === DEFAULT_LAYOUT.version && Array.isArray(parsed.rows)) {
          this._layout.set(parsed);
          return;
        }
      }
    } catch {
      // Silent reset on corrupt data
    }
    this.resetToDefault();
  }

  resetToDefault(): void {
    this._layout.set(structuredClone(DEFAULT_LAYOUT));
    this.persist();
  }

  moveWidget(sourceRowIndex: number, destRowIndex: number, sourceIndex: number, destIndex: number): void {
    this._layout.update(layout => {
      const rows = layout.rows.map(row => [...row]);
      
      const [movedWidget] = rows[sourceRowIndex].splice(sourceIndex, 1);
      
      if (!rows[destRowIndex]) {
        rows[destRowIndex] = [];
      }
      rows[destRowIndex].splice(destIndex, 0, movedWidget);
      
      // Prune empty rows
      const prunedRows = rows.filter(row => row.length > 0);
      
      // ARCH: Immutable update — signal compares by reference
      return { ...layout, rows: prunedRows };
    });
    this.persist();
  }

  removeWidget(widgetId: string): void {
    this._layout.update(layout => {
      const rows = layout.rows
        .map(row => row.filter(w => w.id !== widgetId))
        .filter(row => row.length > 0); // Prune empty rows after filtering
      
      return { ...layout, rows };
    });
    this.persist();
  }

  addWidget(widget: WidgetConfig, rowIndex: number = 0): void {
    this._layout.update(layout => {
      const rows = layout.rows.map(row => [...row]);
      
      if (rows.length === 0) {
        rows.push([widget]);
      } else if (rowIndex >= 0 && rowIndex < rows.length) {
        rows[rowIndex].push(widget);
      } else {
        rows.push([widget]);
      }
      
      return { ...layout, rows };
    });
    this.persist();
  }

  resizeWidget(widgetId: string, size: WidgetSize): void {
    this._layout.update(layout => {
      const rows = layout.rows.map(row => 
        row.map(widget => widget.id === widgetId ? { ...widget, size } : widget)
      );
      
      return { ...layout, rows };
    });
    this.persist();
  }

  isWidgetActive(type: string): boolean {
    return this.activeTypes().includes(type);
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._layout()));
    } catch {
      // Ignore storage errors
    }
  }
}
