import {Injectable, NgZone} from '@angular/core';
import inViewport from 'in-viewport';

export interface InViewOptions {
    container: HTMLElement,
    offset: number;
    debounce: number;
    failsafe: boolean;
    rootMargin: string;
    threshold: number | number[]
}

type inViewFn = (element: HTMLElement) => any;

@Injectable()
export class InViewService {
    private observer: IntersectionObserver;

    constructor(private zone: NgZone) {
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Partial<InViewOptions>} options
     * @param {inViewFn} cb
     */
    watch(element: HTMLElement, options: Partial<InViewOptions>, cb: inViewFn) {
        if (this.supports()) {
            if (!this.observer) {
                this.zone.runOutsideAngular(() => {
                    this.initObserver(cb, options);
                });
            }
            this.zone.runOutsideAngular(() => {
                this.observer.observe(element);
            });

        } else {
            this.zone.runOutsideAngular(() => {
                const watcher = inViewport(element, options, (nativeElement: HTMLElement) => {
                    this.zone.run(() => {
                        cb(nativeElement);
                    });
                    watcher.dispose();
                });
            });
        }
    }

    /**
     *
     * @param {Partial<InViewOptions>} options
     * @returns {any}
     */
    getOptions(options: Partial<InViewOptions>): Partial<InViewOptions> {
        if (this.supports()) {
            return {
                root: options.container || document.body,
                rootMargin: options.rootMargin || '0px',
                threshold: options.threshold || 0
            } as Partial<InViewOptions>;
        }
        return {
            container: options.container || document.body,
            offset: options.offset || 0,
            debounce: options.debounce || 15,
            failsafe: options.failsafe || 150
        } as Partial<InViewOptions>;
    }

    /**
     *
     * @returns {boolean}
     */
    private supports() {
        return 'IntersectionObserver' in window;
    }

    /**
     *
     * @param inViewFn
     * @param options
     */
    private initObserver(cb: inViewFn, options: Partial<InViewOptions>) {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry['isIntersecting']) {
                    this.zone.run(() => {
                        cb(entry.target as HTMLElement);
                    });
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

}
