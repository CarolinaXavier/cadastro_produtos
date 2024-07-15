import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static notEmpty(control: AbstractControl): ValidationErrors | null {
        const value = control.value as string;
        if (!value?.trim()) {
            return { empty: true };
        }
        return null;
    }
}
