// components/job-list/job-list.component.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Wichtig für die async-Pipe!
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, map } from 'rxjs';
import { JobAppService } from '../../services/job-api.service';

import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule hinzugefügt
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  
  private jobService = inject(JobAppService);

    jobs = signal<Job[]>([]);
    selectedJob = signal<Job | undefined>(undefined);
    isLoading = signal<boolean>(true);
    //Für die Such- und Filterbegriffe
    searchQuery = signal<string>('');
    locationQuery = signal<string>('');

  // Signal für die gefilterte Liste
    filteredJobs = computed(() => {
      const allJobs = this.jobs();
      const search = this.searchQuery().toLowerCase().trim();
      const location = this.locationQuery().toLowerCase().trim();

      return allJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search) || 
                              job.department.toLowerCase().includes(search);
        const matchesLocation = job.location.toLowerCase().includes(location);
        
        return matchesSearch && matchesLocation;
      });
    });

    async ngOnInit(): Promise<void> {
        try {
          // Warten, bis das Promise die lokalen JSON-Daten zurückgibt
          const data = await this.jobService.getJobs();
          this.jobs.set(data);
          if (data && data.length > 0) {
            // Findet den ersten Job, der aktiv ist (isActive === true)
            const firstActiveJob = data.find(job => job.isActive);
            
            // Falls ein aktiver Job existiert, setzen wir ihn als Default
            if (firstActiveJob) {
              this.selectedJob.set(firstActiveJob);
            }
          }
        } catch (error) {
          console.error('Fehler beim Laden der lokalen JSON-Datei:', error);
        } finally {
          this.isLoading.set(false);
        }
    }

    // Filter-Funktionen, die vom HTML getriggert werden
    onSearchChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
    }

    onLocationChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.locationQuery.set(value);
    }
  
    async selectJob(id: string, targetElement: HTMLElement): Promise<void> {
        const job = await this.jobService.getJob(id);
        this.selectedJob.set(job);

        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}
