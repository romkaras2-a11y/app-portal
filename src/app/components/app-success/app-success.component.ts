// components/app-success/app-success.component.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="icon-checkmark">✓</div>
        <h1>Vielen Dank für deine Bewerbung!</h1>
        <p>Deine Unterlagen sind erfolgreich bei uns eingegangen.</p>
        <p class="info-text">
          Unser HR-Team wird die Bewerbung sorgfältig prüfen. Wir melden uns innerhalb der nächsten Tage per E-Mail bei dir.
        </p>
        <div class="actions">
          <a routerLink="/" class="btn-home">Zurück zur Jobübersicht</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './app-success.component.scss',
})
export class AppSuccesComponent {}
