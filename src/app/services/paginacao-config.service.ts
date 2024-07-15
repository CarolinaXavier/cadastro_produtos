import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPaginacaoConfig } from '../interfaces/paginacao-config.interface';

@Injectable({
    providedIn: 'root',
})
export class PaginacaoConfigService {
    private paginacaoConfig = new BehaviorSubject<IPaginacaoConfig>({
        limite: 10,
        pagina: 1,
    });

    constructor() { }

    setConfig(values: Partial<IPaginacaoConfig>) {
        this.paginacaoConfig.next({
            ...this.paginacaoConfig.value,
            ...values,
        });
    }

    getConfig(): IPaginacaoConfig {
        return this.paginacaoConfig.value;
    }

    configChanges(): Observable<IPaginacaoConfig> {
        return this.paginacaoConfig.asObservable();
    }
}
