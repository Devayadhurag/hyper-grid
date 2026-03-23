import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      shell works!
    </p>
  `,
  styles: [
  ]
})
export class ShellComponent {

}
