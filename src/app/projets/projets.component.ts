import { Component, OnInit } from '@angular/core';
import { InitAppService } from '../services/init.service';
import { AuthService } from '../auth/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {
  
  projet= [];
  detail= <any>{}; 
  tache= <any>{}; 
  list=true;
  cordinateur:boolean=false;
  show_tache=false;
  user: any;

  constructor(private token: TokenStorageService,
  			  private init: InitAppService,
  			  private authService: AuthService,
  			  private msg: NzMessageService,
              private notification: NzNotificationService,
              public g_var: Global_varService) { }


  ngOnInit() { 
  	this.user=this.token.getUser();
    this.authService.inits().subscribe(
      response => {
         this.projet=response.projets2;
         //console.log("projets",this.projet);
         this.projet_statistique(this.projet);
       },
      error => {
        console.log(error);
      }
    );
  } 
  projet_statistique(projets) {
      for(var i=0;i<projets.length;i++){
         projets[i].nbr_phase=0;
         projets[i].nbr_tache=0;
         projets[i].nbr_sous_tache=0;
         projets[i].nbr_complet=0;
         projets[i].nbr_phase=projets[i].phases.length;
         for(var j=0;j<projets[i].phases.length;j++){
            projets[i].nbr_tache+=projets[i].phases[j].taches.length;
            for(var k=0;k<projets[i].phases[j].taches.length;k++){
               projets[i].nbr_sous_tache+=projets[i].phases[j].taches[k].sousTaches.length;
               projets[i].nbr_complet+=projets[i].phases[j].taches[k].productionTaches.length; 
            }
         }

         projets[i].percent=projets[i].nbr_tache==0?0:(projets[i].nbr_complet*100/projets[i].nbr_tache).toFixed(2);


      }
 
  }

  show_detail(p): void {
    console.log(p);
    this.list=false; 
    this.detail=p;
    this.show_tache=false;
    this.cordinateur=this.is_cordinateur(p);
  }  


  show_task(t): void {
    console.log(t);
    t.show=!t.show;
    this.show_tache=!this.show_tache;
    this.tache=t; 
  }  

  isVisible = false;
  isVisibleDoc = false;
  fileList = [];
  previewImage = '';
  previewVisible = false;
  formData:FormData = new FormData();
  fileUploads: Observable<string[]>;
 
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.thumbUrl;
    this.previewVisible = true;
  }
 
  showModal(): void {
    this.isVisible = true;
    this.fileList=[];
  }

  showModalDoc(): void {
    this.isVisibleDoc = true;
    this.fileList=[];
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
    console.log(this.fileList[0].originFileObj);
    this.formData.append('file', this.fileList[0].originFileObj);
    this.formData.append('tache_id', this.tache.tache.id);
    this.formData.append('eleve_id', this.user.id);
    this.authService.production_tache(this.formData).subscribe(
          data => {
            this.fileList=[];
            this.formData=new FormData();
            console.log(data);
            this.tache.productionTaches.push(data);
            this.notification.create('success', 'Production',
               'ajouté avec succès');  
            this.projet_statistique(this.projet);   
          },
          error => {
            this.fileList=[];  
            this.formData=new FormData();
            this.notification.create('error', 'Production',
               'Erreur de serveur');  
          }
        );
  }

  ajouter_doc(): void {
    this.isVisibleDoc = false;
    console.log(this.fileList[0].originFileObj);
    this.formData.append('file', this.fileList[0].originFileObj);
    this.formData.append('projet_id', this.detail.projet.id); 
    this.authService.document_projet(this.formData).subscribe(
          data => {
            this.fileList=[];
            this.formData=new FormData();
            console.log(data);
            this.detail.documentProjets.push(data);
            this.notification.create('success', 'Document',
               'ajouté avec succès');   
          },
          error => {
            this.fileList=[];  
            this.formData=new FormData();
            this.notification.create('error', 'Document',
               'Erreur de serveur');  
          }
        );
  }

  delete_production(production){ 
    console.log(production);
    this.formData=new FormData();
    this.formData.append('id', production.id);
    this.authService.production_delete(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Production',
               'supprimée avec succès');
            for(var i=0;i<this.tache.productionTaches.length;i++){
            	this.tache.productionTaches.splice(i,1);
            }     
            this.projet_statistique(this.projet);
          },
          error => { 
            this.notification.create('error', 'Production',
               'Erreur de serveur');  
          }
        );

  }

  delete_document(id){
    this.formData=new FormData();
    this.formData.append('id', id);
    this.authService.delete_document(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Document',
               'supprimée avec succès');
            for(var i=0;i<this.detail.documentProjets.length;i++){
              if(this.detail.documentProjets[i].id==id){
                this.detail.documentProjets.splice(i,1);break;
              }
              
            }      
          },
          error => { 
            this.notification.create('error', 'Document',
               'Erreur de serveur');  
          }
        );

  }


  is_my_task(tache): boolean { 
    for(var i=0;i<tache.tacheEleves.length;i++){
      if(tache.tacheEleves[i].eleve_tache.id==this.user.id){
        return true;
      }
    }
    return false;
  }

  get_my_production(tache){ 
    for(var i=0;i<tache.productionTaches.length;i++){
      if(tache.productionTaches[i].eleve.id==this.user.id && tache.productionTaches[i].tache1.id==tache.tache.id){
        return tache.productionTaches[i];
      }
    }
    return null;
  }
  
  get_production(tache){ 
    for(var i=0;i<tache.productionTaches.length;i++){
      if(tache.productionTaches[i].tache1.id==tache.tache.id){
        //console.log({etat:true,production:tache.productionTaches[i]})
        return tache.productionTaches[i];
      }
    }
    //console.log({etat:true,production:null})
    return null;
  }

  is_cordinateur(projet): boolean {
  	for(var i=0;i<projet.groupes.length;i++){
      	for(var j=0;j<projet.groupes[i].users.length;j++){
	        if(projet.groupes[i].users[j].user1.id==this.user.id){
	          if(projet.groupes[i].users[j].coordinateur){ 		
	          return true;}
	        }
	     }  
     } 
     return false;
  }

  my_groupe(projet){
     for(var i=0;i<projet.groupes.length;i++){
      	for(var j=0;j<projet.groupes[i].users.length;j++){
	        if(projet.groupes[i].users[j].user1.id==this.user.id){
	          return projet.groupes[i].groupe;
	        }
	     }  
     }
     return null;
  } 

}
