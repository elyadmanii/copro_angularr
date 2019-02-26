import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './auth/token-storage.service';
import {Router} from "@angular/router"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  roles: string[];
  authority: string;
  connect: boolean;

  constructor(public tokenStorage: TokenStorageService,private router: Router) { }

  ngOnInit() {
    
    if(!this.tokenStorage.getUser()){
      this.connect=false;
      this.router.navigate(['auth/login']);
      this.tokenStorage.isconnect=false;
    }else{
      this.connect=true;  
      this.tokenStorage.isconnect=true;
    }
    
    if(window.innerWidth<1024){
      this.tokenStorage.mobile=false;
    } 
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        } else if (role === 'ROLE_PM') {
          this.authority = 'pm';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
  }
}
