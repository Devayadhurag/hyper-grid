import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TickerItem, TickerTapeComponent } from 'src/app/features/dashboard/components/ticker-tape/ticker-tape.component';
import { LucideAngularModule, LayoutDashboard, TrendingUp, FileText, Settings, ChevronRight, ChevronLeft } from 'lucide-angular';

export interface NavItem {
  icon: any;
  label: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TickerTapeComponent, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  readonly navExpanded = signal(false);
  readonly navHovered = signal(false);
  readonly today = new Date().toISOString();
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;

  readonly tickerItems = signal<TickerItem[]>([
    { symbol: 'SYS_OP', value: 99.98, change: '0.01%', isUp: true },
    { symbol: 'NET_LATENCY_MAX', value: 142.50, change: '4.2%', isUp: false },
    { symbol: 'API_TPS', value: 8402.15, change: '1.5%', isUp: true },
    { symbol: 'ERR_RATE', value: 0.04, change: '0.01%', isUp: false },
    { symbol: 'DB_IOPS', value: 12450.00, change: '2.1%', isUp: true },
    { symbol: 'CACHE_HIT', value: 98.20, change: '0.1%', isUp: true },
    { symbol: 'ACTIVE_USR', value: 2405.00, change: '8.4%', isUp: true },
  ]);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '',
      icon: LayoutDashboard,
    },
    {
      label: 'Analytics',
      route: 'analytics',
      icon: TrendingUp,
    },
    {
      label: 'Reports',
      route: 'reports',
      icon: FileText,
    },
    {
      label: 'Settings',
      route: 'settings',
      icon: Settings,
    },
  ];

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.tickerItems.update(current =>
          current.map(item => {
            const fluctuation = item.value * (Math.random() * 0.01 - 0.005);
            return {
              ...item,
              value: item.value + fluctuation,
              change: Math.abs((fluctuation / item.value) * 100).toFixed(2) + '%',
              isUp: fluctuation >= 0,
            };
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNav(): void {
    this.navExpanded.update(v => !v);
  }
}