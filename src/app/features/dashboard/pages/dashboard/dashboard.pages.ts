import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../widgets/stats-card/stats-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  template: `
    <h1>Dashboard</h1>

    <stats-card></stats-card>
  `,
  styles: [
  ]
})
export class DashboardComponent {

}
