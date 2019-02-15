import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
}) 
export class InitAppService {
  
  initApp={};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.inits().subscribe(
      response => {
        console.log("initApp");
        this.initApp=response;
        console.log(this.initApp);
      },
      error => {
        console.log(error);
      }
    );
  } 
  
}
