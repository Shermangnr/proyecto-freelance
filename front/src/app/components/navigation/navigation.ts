import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation  implements OnInit {
  currentYear: number;

  loginService = inject(LoginService);
  router = inject(Router);

  userName: string | null = null;
  isLoggedIn: boolean = false;

  constructor() {
    this.currentYear = 0;
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.checkLoginStatus();
  }

  // Metodo para verificar el estado de login y obtener el nombre
  checkLoginStatus(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.loginService.getUserName();
    } else {
      this.userName = null;
    }
  }

  // Metodo para cerrar sesion
  onLogout(): void {
    this.loginService.logout();
    this.checkLoginStatus();
    this.router.navigateByUrl('/login');
  }

}
