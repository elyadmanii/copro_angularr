import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Global_varService {

  url = 'http://localhost:8080/';
  //url = 'http://coproline-coproline.1d35.starter-us-east-1.openshiftapps.com/';
  
  timer = 0;
  constructor() { }
  ngOnInit() {
    this.timer=new Date().getTime();
  }
 
}
