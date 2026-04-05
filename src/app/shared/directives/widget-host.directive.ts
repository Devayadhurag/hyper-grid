import { Directive, Input, OnChanges, SimpleChanges, ViewContainerRef, ComponentRef, inject, Type } from '@angular/core';
import { WidgetConfig } from '../../features/dashboard/models/dashboard.models';
import { WidgetRegistryService } from '../../features/dashboard/services/widget-registry.service';

@Directive({
  selector: '[hgWidgetHost]',
  standalone: true
})
export class WidgetHostDirective implements OnChanges {
  @Input('hgWidgetHost') widgetConfig!: WidgetConfig;

  private readonly vcr = inject(ViewContainerRef);
  private readonly registry = inject(WidgetRegistryService);

  private componentRef: ComponentRef<unknown> | null = null;
  private currentType: string | null = null;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['widgetConfig']) {
      const type = this.widgetConfig?.type;
      
      if (type && type !== this.currentType) {
        await this.renderWidget();
      } else if (this.componentRef) {
        // If type hasn't changed, just update the config reference
        const instance = this.componentRef.instance as any;
        if (instance && typeof instance === 'object' && 'config' in instance) {
          instance.config = this.widgetConfig;
          this.componentRef.changeDetectorRef.detectChanges();
        }
      }
    }
  }

  private async renderWidget(): Promise<void> {
    const meta = this.registry.getMeta(this.widgetConfig.type);
    
    if (!meta) {
      console.warn(`Widget type not found in registry: ${this.widgetConfig.type}`);
      return;
    }

    this.destroyComponent();
    
    try {
      const componentType = await meta.componentLoader() as Type<unknown>;
      
      this.vcr.clear();
      this.componentRef = this.vcr.createComponent(componentType);
      this.currentType = this.widgetConfig.type;

      // ARCH: Duck-typing — no compile-time dependency on any widget class
      const instance = this.componentRef.instance as any;
      if (instance && typeof instance === 'object' && 'config' in instance) {
        instance.config = this.widgetConfig;
      }
      
      this.componentRef.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error(`Failed to load component for widget type: ${this.widgetConfig.type}`, e);
    }
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.currentType = null;
  }
}
