// components/application-form/application-form.component.ts 
// Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { Component, OnInit, inject, signal } from '@angular/core'; 
import { FormBuilder, FormArray, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms'; 
import { ActivatedRoute, Router,RouterLink } from '@angular/router';

import { ApplicationService } from '../../services/application.service';
import { JobAppService } from '../../services/job-app.service';
import { Job } from '../../models/job.model'; 
import { pdfFileValidator, fileSizeValidator, dateRangeValidator,uniqueEmailValidator,selectedCheckValidator } from '../../validators/app.validators'; 

@Component({
  selector: 'app-form',
  standalone: true, 
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.scss',
})
export class AppFormComponent implements OnInit{

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private appService = inject(ApplicationService);
    private jobService = inject(JobAppService); 
    
    //form step  Signals für reaktiven State in v22
    currentStep = signal<number>(1);   
    // Deklaration als Signal, das später in ngOnInit initialisiert wird
    currentJob = signal<Job | undefined>(undefined);
    isSubmitted = false;
    isLoading = signal<boolean>(false); // <-- Neues Signal für den Lade-Zustand
   
    // Multiple-Choice Optionen
    readonly channelOptions = [
      'LinkedIn',
      'Arbeitnow (API)',
      'Empfehlung von Freunden',
      'GitHub / Open Source',
      'Andere Plattformen',
      'Sonstiges (Bitte angeben)'
    ];

    appForm = this.fb.group({
        jobId: ['', Validators.required], 
        personalInfo: this.fb.group({ 
          firstName: ['', [Validators.required, Validators.minLength(2)]], 
          lastName: ['', [Validators.required, Validators.minLength(2)]], 
          email: ['', [Validators.required, Validators.email],[uniqueEmailValidator()]], 
          phone: [''],// ]Validators.pattern(/^\+?[\d\s-]{8,}$/)], 
          address: ['']//, Validators.required] 
        }),
        channel : ['',selectedCheckValidator(1)],
        channelOther: [''], 
        experience: this.fb.array([]), 
        documents: this.fb.group({ 
          cv: [null as File | null, [ Validators.required,  pdfFileValidator, fileSizeValidator(5 * 1024 * 1024) ]], 
          coverLetter: [null as File | null, [ pdfFileValidator,  fileSizeValidator(5 * 1024 * 1024) ]] 
        }) 
    });
 
    //Am formular Start ngOnInit ist jetzt async, um Promises mit await aufzulösen
    async ngOnInit() {

        //  Job-ID aus der Route holen
        const jobId = this.route.snapshot.paramMap.get('id');

        if (jobId) {
          this.appForm.patchValue({ jobId: jobId });
          
          try {
            // NEU: Wir warten direkt auf das Promise des Services
            const job = await this.jobService.getJob(jobId);
            this.currentJob.set(job); // Wert direkt in das Signal schreiben
            
          } catch (error) {
            console.error('Fehler beim Laden des Jobs über das Promise:', error);
          }
        }
        // Draft laden falls vorhanden
        const draft = this.appService.getDraft(); 
        if (draft) {
          if (draft.personalInfo) {
            this.appForm.get('personalInfo')?.patchValue(draft.personalInfo);
          }
          if (draft.experience && draft.experience.length > 0) {
              draft.experience.forEach(exp => this.addExperience(exp));
          }         
          if (draft.channel) {
            this.appForm.patchValue({ channel: draft.channel });
          }       
        }
        // Add initial/ or saved experience form group 
        if(this.experience.length===0){         
          this.addExperience(); 
        }

        this.appForm.get('channel')?.valueChanges.subscribe(value => {
          const otherControl = this.appForm.get('channelOther');
          
          if (value === 'Sonstiges (Bitte angeben)') {
            // Wenn "Sonstiges" gewählt ist, wird das Textfeld zum Pflichtfeld
            otherControl?.setValidators([Validators.required]);
          } else {
            // Andernfalls Validierung entfernen und Feld leeren
            otherControl?.clearValidators();
            otherControl?.setValue('',{ emitEvent: false });
          }
          // Validierungsstatus im Formularbaum aktualisieren
          otherControl?.updateValueAndValidity({ emitEvent: false });
        });        
       // 3. Automatisches Speichern bei Formularänderungen 
        this.appForm.valueChanges.subscribe(value => { 
          if (!this.isSubmitted) {
              const rawValue = this.appForm.getRawValue();
            // löschen das File-Objekt , da Dateien nicht als JSON serialisiert werden können.
              const { documents, ...draftData } = rawValue;
              this.appService.saveDraft(draftData as any); 
          }      
          
        }); 
    }

    get personalInfo() { return this.appForm.get('personalInfo') as FormGroup;} 
    get experience() { return this.appForm.get('experience') as FormArray; } 
    get documents() { return this.appForm.get('documents') as FormGroup; } 
    get experienceControls() {    return this.experience.controls as FormGroup[]; }
    get channelControl() { return this.appForm.get('channel'); }
    get channelOtherControl() { return this.appForm.get('channelOther'); }

    addExperience(data?: any): void {
        
          const expGroup = this.fb.group({
            company: [data?.company || '', Validators.required],
            position: [data?.position || '', Validators.required],
            current: [data?.current || false],
            dates: this.fb.group({
              startDate: [data?.dates?.startDate || '', Validators.required],
              endDate: [data?.dates?.endDate || '']
            }, { validators: dateRangeValidator })
          });

          this.experience.push(expGroup);       
    }   
 
    removeExperience(index: number) { 
      this.experience.removeAt(index); 
    }

    toggleCurrentPosition(index: number): void {

      const group = this.experience.at(index).get('dates') as FormGroup;
      const currentControl = this.experience.at(index).get('current');
      
      if (currentControl?.value) {
        group.get('endDate')?.reset();
        group.get('endDate')?.disable();
      } else {
        group.get('endDate')?.enable();
      }
    }

    onFileSelected(event: Event, controlName: string) { 
     
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files; 

      if (fileList && fileList.length > 0) {
        const file = fileList[0]; // Wir nehmen die erste ausgewählte Datei 
       
        this.documents.get(controlName)?.setValue(file, { emitEvent: false });
        this.documents.get(controlName)?.markAsTouched();         
      }else{
         this.documents.get(controlName)?.setValue(null, { emitEvent: false });
      } 
    }

    nextStep(): void { 
      if (Number(this.currentStep()) < 3) {        
        this.currentStep.update(step => Number(step) + 1); 
      } 
    }

    previousStep(): void { 
      if (Number(this.currentStep()) > 1) {
        this.currentStep.update(step => Number(step) - 1); 
      } 
    }

    async onSubmit():Promise <void> {

      if (this.appForm.valid) {
        this.isLoading.set(true); // <-- Spinner starten
        this.isSubmitted = true;
        
        const rawValues = this.appForm.getRawValue();
        const finalChannel = (rawValues.channel === 'Sonstiges (Bitte angeben)') ? rawValues.channelOther : rawValues.channel;

        const finalPayload = { ...rawValues, channel: finalChannel };            
           
        delete (finalPayload as any).channelOther; 

        try{
            const success = await this.appService.submitApplication(finalPayload as any);

            if (success) {
                this.appService.clearDraft();
                this.router.navigate(['/success']);
            }else{
                throw new Error('Server hat die Bewerbung abgelehnt.');
            }              
        }catch(error){             
                console.error('Fehler beim asynchronen Absenden der Bewerbung:', error);
                this.isSubmitted = false;                
                alert('Deine Bewerbung konnte nicht gesendet werden. Bitte überprüfe deine Internetverbindung.');               
             
        }finally{          
            this.isLoading.set(false); 
            this.router.navigate(['/']);           
        }
        
      }
    }
     
    canDeactivate(): boolean { 
      return !this.appForm.dirty || confirm('Du hast ungespeicherte Änderungen. Möchtest du die Seite wirklich verlassen?'); 
    }         
    
}
