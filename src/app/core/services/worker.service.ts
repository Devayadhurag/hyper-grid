import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkerService {

    private worker: Worker;

    constructor() {
        this.worker = new Worker(
            new URL('../../workers/data.worker', import.meta.url)
        );
    }

    run(data: any): Promise<any> {
        return new Promise((resolve) => {
            this.worker.onmessage = ({ data }) => {
                resolve(data);
            };

            this.worker.postMessage(data);
        });
    }
}