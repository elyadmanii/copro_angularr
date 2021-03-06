import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Global_varService } from '../services/global_var.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  authority:string="";
  mob:boolean=true;
  roles= [];
  
  constructor(private token: TokenStorageService,
              public g_var: Global_varService,
              private router: Router) { }
  
  logout() {
    this.token.signOut();
    this.router.navigate(['auth/login']);
    this.token.isconnect=false;
  }
  show_mobile() {
    if(this.mob){
      this.mob=false;
      this.token.mobile=false;
    }else{
      this.mob=true;
      this.token.mobile=true;
    } 
    console.log("mob",this.token.mobile);
  }

  

  ngOnInit() {
    this.user=this.token.getUser();
    this.roles = this.token.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_PROFESSEUR') {
          this.authority = 'professeur';
          return false;
        } else if (role === 'ROLE_ELEVE') {
          this.authority = 'eleve';
          return false;
        }
        this.authority = 'admin';
        return true;
      });
  }

}
