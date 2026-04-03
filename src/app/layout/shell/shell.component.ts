import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <p>
      shell works!
    </p>
    <router-outlet />
  `,
  styles: [
  ]
})
export class ShellComponent {

}
