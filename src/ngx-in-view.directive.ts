import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {InViewOptions, InViewService} from './ngx-in-view.service';

@Directive({
    selector: '[inView]'
})
export class InViewDirective implements AfterViewInit {
    @Input() options: Partial<InViewOptions>;
    @Output() viewport = new EventEmitter<HTMLElement>();

    constructor(private host: ElementRef, private inViewService: InViewService) {
    }

    ngAfterViewInit() {
        this.inViewService.watch(this.host.nativeElement, this.inViewService.getOptions(this.options),
            element => {
                this.viewport.emit(element);
            });
    }

}
