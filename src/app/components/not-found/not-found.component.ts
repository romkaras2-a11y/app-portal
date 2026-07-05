// not-found/not-found.component.ts
//Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="container text-center">
      <h2>404 - Seite nicht gefunden</h2>
      <p>Die gewünschte Job existiert nicht oder ist nicht mehr für Anmeldungen verfügbar.</p>
      <button routerLink="/">Zurück zur Übersicht</button>
    </main>
  `
})
export class NotFoundComponent {}
