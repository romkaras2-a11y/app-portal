// models/app.model.ts
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
export interface Application { 
  jobId: string; 
  personalInfo: PersonalInfo; 
  experience: WorkExperience[]; 
  education: Education[];
  channel:string, 
  channelOther:string,
  documents: Documents; 
} 
 
export interface PersonalInfo { 
  firstName: string; 
  lastName: string; 
  email: string; 
  phone: string; 
  address: string; 
} 
 
export interface WorkExperience { 
  company: string; 
  position: string; 
  startDate: Date; 
  endDate?: Date; 
  current: boolean; 
  description: string; 
} 
 
export interface Education { 
  institution: string; 
  degree: string; 
  field: string; 
  graduationDate: Date; 
} 
 
export interface Documents { 
  cv: File; 
  coverLetter?: File; 
} 