import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  authority:string="";
  roles= [];
  
  constructor(private token: TokenStorageService,
              public g_var: Global_varService) { }
  
  logout() {
    this.token.signOut();
    window.location.reload();
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
