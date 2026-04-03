import { Component, inject } from '@angular/core';
import { StatsCardStore } from './stats-card.store';
import { WorkerService } from '../../../../core/services/worker.service';

@Component({
    selector: 'stats-card',
    standalone: true,
    providers: [StatsCardStore],
    template: `
    <div class="card">
      <h3>Stats Card</h3>

      <button (click)="load()">Load Data</button>

      <p>Count: {{ vm().count }}</p>
      <p>Total: {{ vm().total }}</p>
      <p>Average: {{ vm().avg }}</p>
    </div>
  `,
    styles: [`
    .card {
      padding: 16px;
      border: 1px solid #333;
      border-radius: 8px;
      width: 250px;
    }
  `]
})
export class StatsCardComponent {
    private store = inject(StatsCardStore);
    private worker = inject(WorkerService);

    vm = this.store.vm;

    async load() {
        const raw = [10, 20, 30, 40, 50];

        const processed = await this.worker.run(raw);

        this.store.setData(processed);
    }
}