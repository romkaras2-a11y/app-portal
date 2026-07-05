// services/job-api.service.ts
import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { firstValueFrom} from 'rxjs';
import { Job } from '../models/job.model'; 
import { environment } from '../../environments/environment.dev';
 
@Injectable({ 
  providedIn: 'root' 
}) 
export class JobAppService { 

  private apiUrl =environment.jobsApiUrl;
  private localJsonUrl = './assets/jobs.json';

  // In-Memory Cache, um die API nicht bei jedem Klick neu abzufragen
  private cachedJobs: Job[] | null = null;
    constructor(private http: HttpClient) { } 


    //zum Abrufen und Transformieren der API-Daten, Gibt jetzt ein Promise zurück
  async getJobs(): Promise<Job[]> {      
    if (this.cachedJobs) {
      return this.cachedJobs;
    }

    try {
      // 1. Erst das nackte API-Ergebnis per await abholen
      const response: any = await firstValueFrom(this.http.get<any>(this.apiUrl));
      
      // 2. Sicherstellen, dass das Daten-Array existiert
      const apiJobsArray = response?.data || [];
      let localJobArray: Job[] = [];
      // 3. Definition der erlaubten Tech-Filterbegriffe (Kleingeschrieben für sicheren Vergleich)
      const allowedKeywords = [
        'softwareentwicklung', 'php', 'javascript', 'frontend',
        'Software Developer','Software Development','Fullstack Entwickler'
      ];

      // 4. Echte API-Jobs vorfiltern (bevor wir sie transformieren)
      const filteredApiJobs = apiJobsArray.filter((apiJob: any) => {
        const title = (apiJob.title || '').toLowerCase();
        const description = (apiJob.description || '').toLowerCase();
        // Tags in einen gemeinsamen String verwandeln, um einfacher zu suchen
        const tagsString = (apiJob.job_types ? [...apiJob.tags,...apiJob.job_types]:apiJob.tags  || []).join(' ').toLowerCase();

        // Prüfen, ob mindestens eines unserer Keywords im Job vorkommt
        return allowedKeywords.some(keyword => 
          title.includes(keyword) || description.includes(keyword) || tagsString.includes(keyword) );
      });
      console.log('Gefilterte API-Jobs Anzahl:', filteredApiJobs.length);
      // 5. Nur die gefilterten API-Jobs mit dem JavaScript-Standard .map() umbauen   
      
      const mappedApiJobs: Job[] = filteredApiJobs.map( (apiJob: any, index: number) => ({         
        id: (index + 1).toString(), 
        title: apiJob.title, 
        department: (apiJob.tags && apiJob.tags.length > 0) ? apiJob.tags.join(","): 'Softwareentwicklung',
        location: apiJob.location, 
        description: apiJob.description ? apiJob.description.replace(/<[^>]*>/g, '') : '',         
        requirements: apiJob.job_types ? [...apiJob.tags,...apiJob.job_types]:apiJob.tags || ['Remote Experience', 'Tech Stack'], 
        isActive: true 
      }) );       
      
      // 6. Lokale JSON-Datei laden (Deine Test-Jobs)      

      try {
       localJobArray = await firstValueFrom(this.http.get<Job[]>(this.localJsonUrl));
      } catch (e) {
        console.warn('Lokale jobs.json konnte nicht geladen werden, nutze nur API-Jobs:', e);
      }      

      this.cachedJobs = [...localJobArray,...mappedApiJobs||[] ];  
       console.log(this.cachedJobs.length);
    return this.cachedJobs;     

    } catch (error) {
      console.error('Fehler beim Abrufen der Live-API:', error);
      return [];
    }
  }

  // Nutzt await, um auf die Daten zu warten, und filtert sie dann
    async getJob(id: string): Promise<Job | undefined> {
      const jobs = await this.getJobs();
      return jobs.find(q => q.id === id);
    }

}
