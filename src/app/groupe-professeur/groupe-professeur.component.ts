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
  groupe_id:number=0; 
  eleves= [];
  users_selected = [];
  formData:FormData = new FormData();
  coordinateur: any; 
  isVisible:boolean=false;
  isVisible_groupe:boolean=false;

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

  to_update_groupe(g){
    this.isVisible_groupe=true;
    
    this.groupe_id=g.groupe.id;

    this.users_selected=[];
    this.nom=g.groupe.nom;

    for(var i=0;i<this.eleves.length;i++){
      for(var j=0;j<g.users.length;j++){
        if(this.eleves[i].id==g.users[j].user1.id){
          this.users_selected.push(this.eleves[i]);
          if(g.users[j].coordinateur){
            this.coordinateur=this.users_selected[this.users_selected.length-1];
          }
          break;
        }
      }
    }
  }
  delete_groupe(g){
    console.log(g);
    this.formData=new FormData();
    this.formData.append('id', g.groupe.id);
    this.authService.delete_groupe(this.formData).subscribe(
    data => { 
        this.notification.create('success', 'Groupe',
           'supprimée avec succès');
        this.change_eleves();
      },
      error => { 
        this.notification.create('error', 'Groupe',
           'Erreur de serveur');  
      }
    );

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
       
      var dd={id:0,
              nom:this.nom, 
              users:users,
              coordinateur:this.coordinateur.id};
      console.log(dd);  
 	  this.isVisible=false;
      this.authService.add_groupe(dd).subscribe(
        data => { 
        	this.nom="";
    			this.users_selected = [];
    			this.coordinateur={}; 
    			this.change_eleves();
            this.notification.create('success', 'Groupe',
             'ajouté avec succès');  
        },
        error => { 
          this.notification.create('error', 'Groupe',
             'Erreur de serveur');  
        }
      );
  }

  modifier(){
      
      var users=[];
      for(var i=0;i<this.users_selected.length;i++){
          users.push(this.users_selected[i].id);
      }
       
      var dd={id:this.groupe_id,
              nom:this.nom, 
              users:users,
              coordinateur:this.coordinateur.id};
      console.log(dd);  
      this.isVisible_groupe=false;
      this.authService.update_groupe(dd).subscribe(
        data => { 
          this.nom="";
          this.users_selected = [];
          this.coordinateur={}; 
          this.change_eleves();
            this.notification.create('success', 'Groupe',
             'modifié avec succès');  
        },
        error => { 
          this.notification.create('error', 'Groupe',
             'Erreur de serveur');  
        }
      ); 
  }

  
 

}
