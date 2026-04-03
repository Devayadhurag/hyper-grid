import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  viewBox?: string;
}

export interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  readonly navExpanded = signal(false);
  readonly today = new Date().toISOString();

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '',
      icon: `<svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>`,
    },
    {
      label: 'Analytics',
      route: 'analytics',
      icon: `<svg viewBox="0 0 16 16"><polyline points="1,12 5,7 9,9 15,3"/><polyline points="11,3 15,3 15,7"/></svg>`,
    },
    {
      label: 'Reports',
      route: 'reports',
      icon: `<svg viewBox="0 0 16 16"><rect x="2" y="1" width="12" height="14" rx="1"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></svg>`,
    },
    {
      label: 'Positions',
      route: 'positions',
      icon: `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/><line x1="8" y1="4" x2="8" y2="8"/><line x1="8" y1="8" x2="11" y2="10"/></svg>`,
    },
  ];

  readonly tickerItems: TickerItem[] = [
    { symbol: 'AAPL', price: '$187.42', change: '1.24%', positive: true },
    { symbol: 'MSFT', price: '$415.80', change: '0.87%', positive: true },
    { symbol: 'NVDA', price: '$875.12', change: '-0.43%', positive: false },
    { symbol: 'TSLA', price: '$182.63', change: '-2.11%', positive: false },
    { symbol: 'AMZN', price: '$191.34', change: '0.55%', positive: true },
    { symbol: 'GOOG', price: '$170.92', change: '1.03%', positive: true },
    { symbol: 'META', price: '$510.27', change: '2.18%', positive: true },
    { symbol: 'SPY', price: '$524.11', change: '-0.19%', positive: false },
    { symbol: 'BTC', price: '$68,441', change: '3.45%', positive: true },
    { symbol: 'NFLX', price: '$628.90', change: '1.62%', positive: true },
  ];

  toggleNav(): void {
    this.navExpanded.update(v => !v);
  }
}