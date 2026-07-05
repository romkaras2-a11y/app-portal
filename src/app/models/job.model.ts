// models/job.model.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
export interface Job {
    id:string,
    title:string,
    department: string; 
    location: string; 
    description: string; 
    requirements: string[]; 
    isActive: boolean;    
}