import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Create } from './components/create/create';

export const routes: Routes = [
        { path: '', redirectTo: '/home', pathMatch: 'full' },
        
    { path: 'home', component: Home },
    { path: 'crear-mueble', component: Create },
];
