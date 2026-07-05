// guards/app-guard.guard.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01

import { CanDeactivateFn } from '@angular/router'; 
import { AppFormComponent } from '../components/app-form/app-form.component';

export const appChangesGuard: CanDeactivateFn<AppFormComponent> = (component) => {
  // Wenn das Formular geändert wurde und noch nicht abgesendet ist, fragen wir den User
  if (component.appForm.dirty && !component.isSubmitted) {
    return confirm('Du hast ungespeicherte Änderungen. Möchtest du die Seite wirklich verlassen?');
  }
  return true;
};

/* default Lösung unvollständig
interface CanComponentDeactivate {   canDeactivate: () => boolean; } 
 
export const  appChangesGuard: CanDeactivateFn<CanComponentDeactivate> =  
  (component) => component.canDeactivate(); 
*/
