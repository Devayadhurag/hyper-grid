import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface TickerItem {
  symbol: string;
  value: number;
  change: string;
  isUp: boolean;
}

@Component({
  selector: 'hg-ticker-tape',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  host: { class: 'ticker' },
  template: `
    <div class="ticker__track">
      @for (item of items().concat(items()); track $index) {
        <span class="ticker__item">
          <span class="ticker__sym">{{ item.symbol }}</span>
          <span class="ticker__price">{{ item.value | number:'1.2-2' }}</span>
          <span class="ticker__change"
            [class.ticker__change--pos]="item.isUp"
            [class.ticker__change--neg]="!item.isUp">
            {{ item.isUp ? '+' : '' }}{{ item.change }}
          </span>
        </span>
      }
    </div>
  `,
  styles: [`
    .ticker__track {
      display: flex;
      align-items: center;
      animation: crawl 40s linear infinite;
      white-space: nowrap;
      width: max-content;
    }

    @keyframes crawl {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .ticker__item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 18px;
      border-right: 1px solid rgba(111, 251, 190, 0.08);
    }

    .ticker__sym {
      font-size: 10px;
      font-weight: 700;
      color: var(--tertiary-fixed, #6ffbbe);
      letter-spacing: 0.08em;
    }

    .ticker__price {
      font-size: 10px;
      color: rgba(111, 251, 190, 0.6);
      letter-spacing: 0.03em;
      font-variant-numeric: tabular-nums;
    }

    .ticker__change {
      font-size: 10px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }

    .ticker__change--pos { color: var(--tertiary-fixed, #6ffbbe); }
    .ticker__change--neg { color: #ff6b6b; }
  `]
})
export class TickerTapeComponent {
  readonly items = input.required<TickerItem[]>();
}