// validators/app.validator.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { inject } from '@angular/core'; 
import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { ApplicationService } from '../services/application.service'; 
import { delay, map,catchError } from 'rxjs/operators'; 

export function pdfFileValidator(control: AbstractControl): ValidationErrors | null { 
  if (!control.value) { 
    return null; 
  } 
   
  const file = control.value as File; 
  return file.type === 'application/pdf' ? null : { invalidFileType: true }; 
} 
 
export function fileSizeValidator(maxSize: number) { 
  return (control: AbstractControl): ValidationErrors | null => { 
    if (!control.value) { 
      return null; 
    } 
     
    const file = control.value as File; 
    return file.size <= maxSize ? null : {  
      invalidFileSize: {  
        maxSize,  
        actualSize: file.size  
      }  
    }; 
  }; 
}

export function dateRangeValidator(control: AbstractControl): ValidationErrors | null { 
  const start = control.get('startDate')?.value; 
  const end = control.get('endDate')?.value; 
   
  if (!start || !end) { 
    return null; 
  } 
 
  return start < end ? null : { invalidDateRange: true }; 
}
   // Die Validator-Funktion nutzt den AppService
export function uniqueEmailValidator() {
  const appService = inject(ApplicationService);
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return appService.validateEmail(control.value).pipe(
          map(isValid => (isValid ? null : { emailTaken: true })),
          catchError(() => [null]) // Fehlertoleranz, falls API abstürzt
        );
      };
}
export function selectedCheckValidator(min = 1){

    return (control: AbstractControl): ValidationErrors | null => {
      // Sicherstellen, dass es sich um ein FormArray handelt
      if (control instanceof FormArray) {
          // Wir mappen die Controls auf ihre Boolean-Werte (true/false) und zählen die 'true'-Einträge
          const totalSelected = control.controls
            .map(c => c.value)
            .reduce((prev, next) => (next === true ? prev + 1 : prev), 0);
          // Wenn die Mindestanzahl erreicht ist, geben wir null (gültig) zurück, ansonsten den Fehler
          return totalSelected >= min ? null : { requiredCheckbox: true };
      }
      
      return null;
    };
}