import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificacaoModel } from '../../models/notificacao.model';

@Injectable({
    providedIn: 'root'
})
export class NotificacaoService {

    private templates: NotificacaoModel[] = [];
    private notificacoes!: BehaviorSubject<NotificacaoModel[]>;

    constructor() {
        this.notificacoes = new BehaviorSubject(this.templates);
    }

    changes(): Observable<NotificacaoModel[]> {
        return this.notificacoes.asObservable();
    }

    add(n: NotificacaoModel) {
        this.notificacoes.next([n, ...this.notificacoes.value]);
    }

    remove(timestamp: Date) {
        this.notificacoes.next(
            this.notificacoes.value.filter((el) => el.timestamp != timestamp)
        );
    }
}
