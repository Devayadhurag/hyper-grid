import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseWidget } from '../../base-widget';

@Component({
  selector: 'hg-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="stub">Settings — coming soon</div>`,
  styles: [`
    .stub {
      padding: 20px;
      color: #45464d;
      font-size: 12px;
      font-style: italic;
    }
  `]
})
export class SettingsComponent extends BaseWidget {
  protected override onWidgetInit(): void {}
}
