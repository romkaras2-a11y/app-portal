// services/job-app.service.ts
import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Job } from '../models/job.model'; 
 
@Injectable({ 
  providedIn: 'root' 
}) 
export class JobAppService { 
   
    private jsonUrl = './assets/jobs.json';

    constructor(private http: HttpClient) { }

   // Gibt jetzt ein Promise zurück
    async  getJobs(): Promise<Job[]> {      
      return firstValueFrom(this.http.get<Job[]>(this.jsonUrl));
    } 
  // Nutzt await, um auf die Daten zu warten, und filtert sie dann
    async getJob(id: string): Promise<Job | undefined> {
      const jobs = await this.getJobs();
      return jobs.find(q => q.id === id);
    }
 
}
