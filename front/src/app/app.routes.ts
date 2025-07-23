import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Servicios } from './components/servicios/servicios';
import { MyServices } from './components/my-services/my-services';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    {path: 'about-us', title: 'About Us', component: AboutUs},
    {path: 'login', title: 'Login', component: Login},
    {path: 'register', title: 'Register', component: Register},
    {path: 'servicios', title: 'Services', component: Servicios},
    {path: 'my-services', title: 'My-Services', component: MyServices},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
