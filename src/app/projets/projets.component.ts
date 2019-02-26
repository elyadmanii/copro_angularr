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
  isVisibleProd:boolean=false;
  isVisibleTache_Add:boolean=false;
  isVisibleTache_Update:boolean=false;
  isVisiblePhase_Add:boolean=false;
  isVisiblePhase_Update:boolean=false;
  isVisible_s_Tache_Update:boolean=false;
  isVisible_s_Tache_Add:boolean=false;



  show_tache=false;
  user: any;
  authority:string="";
  roles= [];
 
  tache_update={  
    nom:"",
    description:"",
    date:[], 
  }

  tache_add={  
    nom:"",
    description:"",
    date:[], 
  }

  s_tache_update={  
    nom:"",
    description:"",
  }

  s_tache_add={  
    nom:"",
    description:"",
  }

  phase_update={  
    nom:"",
    description:"",
    date:[], 
  }

  phase_add={  
    nom:"",
    description:"",
    date:[], 
  }

  constructor(private token: TokenStorageService,
  			  private init: InitAppService,
  			  private authService: AuthService,
  			  private msg: NzMessageService,
              private notification: NzNotificationService,
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

    this.authService.inits().subscribe(
      response => {
         this.projet=response.projets2;
         //console.log("projets",this.projet);
         this.projet_statistique(this.projet);
       },
      error => {
        //console.log(error);
      }
    );
  }

  to_update_tache(t){
    console.log(t);
    this.tache_update=t.tache;
    this.tache_update.date=[];
    this.tache_update.date.push(new Date(t.tache.dateDebut));
    this.tache_update.date.push(new Date(t.tache.dateFin));
    
    this.isVisibleTache_Update=true;
  } 

  to_add_tache(){   
    this.tache_add.date.push(new Date());
    this.tache_add.date.push(new Date());
    this.isVisibleTache_Add=true;
  } 

  to_update_s_tache(s){
    console.log(s);
    this.s_tache_update=s; 
    this.isVisible_s_Tache_Update=true;
  } 

  to_add_s_tache(){    
    this.isVisible_s_Tache_Add=true;
  } 

  to_add_phase(){   
    this.phase_add.date.push(new Date());
    this.phase_add.date.push(new Date());
    this.isVisiblePhase_Add=true;
  }

  to_update_phase(t){
    console.log(t);
    this.phase_update=t.phase;
    this.phase_update.date=[];
    this.phase_update.date.push(new Date(t.phase.dateDebut));
    this.phase_update.date.push(new Date(t.phase.dateFin));
    
    this.isVisiblePhase_Update=true;
  } 


  onChange(result: Date[]): void {  
    console.log('result: ', result);
  }


  projet_statistique(projets){
      //console.log("projets",projets);
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
      }
      
       
      for(var i=0;i<projets.length;i++){
        for(var k=0;k<projets[i].groupes.length;k++){
          projets[i].groupes[k].task_complet=0;
        }
        this.statistique(projets[i]);

        for(var k=0;k<projets[i].groupes.length;k++){
          projets[i].groupes[k].percent=projets[i].nbr_tache==0?0:(projets[i].groupes[k].task_complet*100/projets[i].nbr_tache).toFixed(2);;
        } 
      }
       
      
 
  }

  statistique(projet){ 
    
    for(var j=0;j<projet.phases.length;j++){ 
      for(var k=0;k<projet.phases[j].taches.length;k++){
          this.count_tache_complet(projet.phases[j].taches[k],projet.groupes)
      }
    }
  }

  count_tache_complet(tache,groupes){
    for(var k=0;k<groupes.length;k++){
      for(var j=0;j<groupes[k].users.length;j++){

        for(var i=0;i<tache.productionTaches.length;i++){ 
          if(tache.productionTaches[i].eleve.id==groupes[k].users[j].user1.id){
            groupes[k].task_complet++; 
          }
        }          
      }
    }
       
  }

  show_detail(p): void {
    //console.log(p);
    this.list=false; 
    this.detail=p;
    this.show_tache=false;
    this.cordinateur=this.is_cordinateur(p);
  }  


  show_task(t): void {
    //console.log(t);
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
    //console.log(this.fileList[0].originFileObj);
    this.formData.append('file', this.fileList[0].originFileObj);
    this.formData.append('tache_id', this.tache.tache.id);
    this.formData.append('eleve_id', this.user.id);
    this.authService.production_tache(this.formData).subscribe(
          data => {
            this.fileList=[];
            this.formData=new FormData();
            //console.log(data);
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
    //console.log(this.fileList[0].originFileObj);
    this.formData.append('file', this.fileList[0].originFileObj);
    this.formData.append('projet_id', this.detail.projet.id); 
    this.authService.document_projet(this.formData).subscribe(
          data => {
            this.fileList=[];
            this.formData=new FormData();
            //console.log(data);
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
    //console.log(production);
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
    //console.log("tache",tache);
    for(var i=0;i<tache.productionTaches.length;i++){
      if(tache.productionTaches[i].eleve.id==this.user.id && tache.productionTaches[i].tache1.id==tache.tache.id){
        //console.log("productionTaches",tache.productionTaches[i]);
        return tache.productionTaches[i];
      }
    }
    return null;
  }
  
  get_production(tache){  
    for(var i=0;i<tache.productionTaches.length;i++){
      if(tache.productionTaches[i].tache1.id==tache.tache.id){ 
        return tache.productionTaches[i];
      }
    } 
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
     return {id:0};
  } 
  
  productions=[];
  show_productions(tache){
     console.log(tache);
     this.isVisibleProd=true; 
     this.productions=tache.productionTaches;
  } 

  

}
