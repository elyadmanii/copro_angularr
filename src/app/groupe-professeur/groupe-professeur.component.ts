import { Component, OnInit } from '@angular/core';
import { InitAppService } from '../services/init.service';
import { AuthService } from '../auth/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-groupe-professeur',
  templateUrl: './groupe-professeur.component.html',
  styleUrls: ['./groupe-professeur.component.css']
})
export class GroupeProfesseurComponent implements OnInit {

  user: any; 
  nom:string="";
  groupes= []; 
  eleves= [];
  users_selected = [];
  coordinateur: any; 
  isVisible:boolean=false;

  constructor(private token: TokenStorageService,
  			  private init: InitAppService,
  			  private authService: AuthService,
  			  private msg: NzMessageService,
              private notification: NzNotificationService,
              public g_var: Global_varService) { }


  ngOnInit() { 
  	this.user=this.token.getUser();
  	this.change_eleves();
    this.authService.eleves().subscribe(
	      response => {
	        console.log(response); 
	        this.eleves = response;
 	      },
	      error => {
	        console.log(error);
 	      }
	);

  } 
  
  init_groupes(){
  	this.coordinateur={};
  }

  change_eleves(){
  	this.authService.gestion_groupes().subscribe(
      response => {
        this.groupes=response;
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  ajouter(){
      var users=[];
      for(var i=0;i<this.users_selected.length;i++){
          users.push(this.users_selected[i].id);
      }
       
      var dd={nom:this.nom, 
              users:users,
              coordinateur:this.coordinateur.id};
      console.log(dd);  
 	  this.isVisible=false;
      this.authService.add_groupe(dd).subscribe(
        data => { 
        	this.nom="";
			this.users_selected = [];
			this.coordinateur={}; 
			
            this.notification.create('success', 'Groupe',
             'ajouté avec succès');  
        },
        error => { 
          this.notification.create('error', 'Groupe',
             'Erreur de serveur');  
        }
      );
  }

  
 

}
