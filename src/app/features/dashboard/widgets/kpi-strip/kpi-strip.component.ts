import { Component, ChangeDetectionStrategy, signal, OnDestroy } from '@angular/core';
import { BaseWidget } from '../../base-widget';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface KpiCard {
  label: string;
  value: string | number;
  trend: string;
  sparkline: number[];
  isUp: boolean;
}

@Component({
  selector: 'hg-kpi-strip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi-container">
      @for (kpi of cards(); track kpi.label) {
        <div class="kpi-card">
          <div class="kpi-content">
            <div class="label">{{ kpi.label }}</div>
            <div class="value-row">
              <span class="value">{{ kpi.value }}</span>
              <span class="trend" [class.up]="kpi.isUp" [class.down]="!kpi.isUp">{{ kpi.trend }}</span>
            </div>
          </div>
          <svg viewBox="0 0 60 24" class="sparkline" preserveAspectRatio="none">
            <polyline [attr.points]="toPoints(kpi.sparkline)" [attr.stroke]="kpi.isUp ? '#10b981' : '#ef4444'" />
          </svg>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .kpi-container {
      display: flex;
      gap: 1px;
      /* Background IS the divider */
      background: #eceef0;
      height: 100%;
    }
    
    .kpi-card {
      flex: 1;
      background: #ffffff;
      padding: 16px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    
    .kpi-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    
    .value-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      white-space: nowrap;
    }
    
    .value {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #131b2e;
    }
    
    .trend {
      font-size: 12px;
      font-weight: 600;
      
      &.up { color: #10b981; }
      &.down { color: #ef4444; }
    }
    
    .sparkline {
      width: 60px;
      height: 24px;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `]
})
export class KpiStripComponent extends BaseWidget implements OnDestroy {
  readonly cards = signal<KpiCard[]>([
    { label: 'Total Revenue', value: '$124.5K', trend: '+12.4%', sparkline: [10, 12, 14, 18, 20, 24, 30], isUp: true },
    { label: 'Active Subscriptions', value: '8,402', trend: '+4.2%', sparkline: [5, 5, 6, 8, 8, 9, 10], isUp: true },
    { label: 'Customer Churn', value: '1.2%', trend: '-0.4%', sparkline: [8, 7, 7, 5, 3, 2, 1], isUp: true },
    { label: 'Avg User Session', value: '4m 12s', trend: '-1.1%', sparkline: [10, 8, 9, 6, 5, 5, 4], isUp: false },
    { label: 'Acquisition Cost', value: '$42.10', trend: '+2.4%', sparkline: [20, 22, 21, 24, 25, 28, 30], isUp: false },
  ]);

  private readonly destroy$ = new Subject<void>();

  protected override onWidgetInit(): void {
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cards.update(current => 
          current.map(card => {
            const lastVal = card.sparkline[card.sparkline.length - 1];
            const fluctuation = lastVal * (Math.random() * 0.4 - 0.2);
            let newVal = lastVal + fluctuation;
            if (newVal < 0) newVal = 1;
            
            const newSparkline = [...card.sparkline.slice(1), newVal];
            return {
              ...card,
              sparkline: newSparkline
            };
          })
        );
      });
  }

  toPoints(data: number[]): string {
    if (!data || data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = (max - min) || 1;
    const height = 24;
    const width = 60;
    const step = width / (data.length - 1 || 1);
    
    return data.map((val, index) => {
      const x = index * step;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
