import { Injectable } from '@angular/core'; 
import { CanActivate, Router } from "@angular/router";
import { TokenStorageService } from './auth/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private token: TokenStorageService,private router: Router) { }

  canActivate() { 
    if(!this.token.getUser()){
      this.router.navigate(['auth/login']);
    }
    return true;
  }
}
