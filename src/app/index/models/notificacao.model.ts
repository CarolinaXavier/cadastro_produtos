import { Type } from '@angular/core';

export class NotificacaoModel {
    component!: Type<any>;
    inputs?: Record<string, unknown>;
    timestamp!: Date;

    constructor(config: {
        component: Type<any>;
        inputs?: Record<string, unknown>;
    }) {
        this.component = config.component;
        this.timestamp = new Date();
        let inputs = config.inputs ? config.inputs : {};
        this.inputs = Object.assign(inputs, { timestamp: this.timestamp });
    }
}