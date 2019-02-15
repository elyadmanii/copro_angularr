import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Global_varService {

  url = 'http://localhost:8080/';
  timer = 0;
  constructor() { }
  ngOnInit() {
    this.timer=new Date().getTime();
  }
 
}
