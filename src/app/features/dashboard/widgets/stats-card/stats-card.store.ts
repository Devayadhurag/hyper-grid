import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class StatsCardStore {
    private data = signal<number[]>([]);

    readonly vm = computed(() => {
        const d = this.data();

        const total = d.reduce((a, b) => a + b, 0);
        const avg = d.length ? total / d.length : 0;

        return {
            total,
            avg,
            count: d.length,
        };
    });

    setData(data: number[]) {
        this.data.set(data);
    }
}