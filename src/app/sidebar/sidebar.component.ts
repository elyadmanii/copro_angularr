import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any;
  authority:string="";
  roles= [];
  
  constructor(private token: TokenStorageService,
              public g_var: Global_varService) { }

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
