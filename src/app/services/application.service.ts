// services/application.service.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { Injectable } from '@angular/core'; 
import { Observable, of } from 'rxjs';
import { Application } from '../models/app.model'; 
 
@Injectable({ providedIn: 'root' })
// a) Punkt 4:Service für Stellenanzeigen-Verwaltung 
export class ApplicationService {
    
    private readonly STORAGE_KEY = 'draft_application';
    // Eine freie öffentliche REST-API, die HTTP-POST-Anfragen akzeptiert und spiegelt 
    private mockApiUrl = 'https://typicode.com';

    saveDraft(application: Partial<Application>): void{
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(application)); 
    }

    getDraft(): Partial<Application> | null{
        const draft = localStorage.getItem(this.STORAGE_KEY);
       return draft ? JSON.parse(draft) : null; 
    }

    clearDraft(): void { 
        localStorage.removeItem(this.STORAGE_KEY); 
    }

async submitApplication(application: Application): Promise<boolean> { 
        try {
            // Da wir keine echten Dateien über JSONPlaceholder senden können,     
            const { documents, ...textData } = application as any;

            // Echten HTTP-POST-Request simulieren
            const response = await fetch(this.mockApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Bewerbung für Job ID: ${textData.jobId}`,
                    body: JSON.stringify(textData),
                    userId: 1
                })
            });

        // Der Server antwortet bei erfolgreichem Erstellen mit Status 201
          if (response.ok) {
            const responseData = await response.json();
            console.log('API-Mock-Server Antwort erfolgreich:', responseData);
            return true;
          }      
           return false;
        }catch (error) {            
            console.error('Fehler beim simulierten API-Call:', error);
            return false;
        }
    } 
    
    validateEmail(email: string): Observable<boolean> { 
        // Simulate email validation 
        return of(!email.includes('test')); 
    }          
}
