// Angular (K4.0028_4.0) Übung 8.2.Ü.01
import { Routes } from '@angular/router';
import { appChangesGuard } from './guards/app-changes.guard';
import { JobListComponent } from './components/job-list/job-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


export const routes: Routes = [    
    {
        path:'',
        component:JobListComponent
    },
    //Lazy Loading für das Bewerbungsformular 
    //Parametrisierte Route für spezifische Stellenanzeigen 
    //Route Guard für ungespeicherte Änderungen    
    {
        path:'jobs/:id/apply',
        loadComponent: () => import('./components/app-form/app-form.component')
        .then(m => m.AppFormComponent),    
        canDeactivate: [appChangesGuard] 
    },
    {
        path: 'success', // Neue Erfolgsseite
        loadComponent: () => import('./components/app-success/app-success.component')
        .then(m => m.AppSuccesComponent)
    },
    //Wildcard Route für die 404-Seite 
    {
        path: '**', 
        component:NotFoundComponent
    }        
];

