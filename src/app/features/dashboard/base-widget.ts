import { Directive, Input, OnInit } from '@angular/core';
import { WidgetConfig } from './models/dashboard.models';

// ARCH: Directive not Component — no host element, widget mounts as sibling
@Directive()
export abstract class BaseWidget implements OnInit {
  @Input() config!: WidgetConfig;
  
  ngOnInit(): void { 
    this.onWidgetInit(); 
  }
  
  protected abstract onWidgetInit(): void;
}
