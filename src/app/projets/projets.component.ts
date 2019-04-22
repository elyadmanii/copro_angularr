import { Component, OnInit } from '@angular/core';
import { InitAppService } from '../services/init.service';
import { AuthService } from '../auth/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Global_varService } from '../services/global_var.service';
import {Router} from "@angular/router"


@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {
  
  projet= [];
  detail= <any>{}; 
  tache= <any>{}; 
  task= <any>{};
  list=true;
  cordinateur:boolean=false;
  projet_groupe={groupes:[],
                 projet:{id:0}};
  isVisibleProd:boolean=false;
  isVisibleTache_Add:boolean=false;
  isVisibleTache_Update:boolean=false;
  isVisiblePhase_Add:boolean=false;
  isVisiblePhase_Update:boolean=false;
  isVisible_s_Tache_Update:boolean=false;
  isVisible_s_Tache_Add:boolean=false;
  isVisibleProjet_Update:boolean = false;
  isVisibleGroupe_Update:boolean = false;
  isVisibleAffectations:boolean = false;
  groupes = [];
  groupes_selected = [];
  eleves_taches = [];

  grps=[];
  grp={
  users:[],
  groupe:{id:0}
  };
 

  eleves=[];
  eleve={user1:{}};



  show_tache=false;
  user: any;
  authority:string="";
  roles= [];
  projet_update={
      projet:{id:0},
      nom:"",
      description:"",
      date:[]
  };

  tache_update={  
    id:0,
    nom:"",
    description:"",
    date:[],

  }

  tache_add={  
    phase:{},
    nom:"",
    description:"",
    date:[], 
  }

  s_tache_update={  
    id:0,
    nom:"",
    description:"",
  }

  s_tache_add={  
    tache:{},
    nom:"",
    description:"",
  }

  phase_update={
    id:0,  
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
          public g_var: Global_varService,
          private router: Router) { }

  
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

    if (this.authority == 'professeur') {
        this.authService.groupes_prof().subscribe(
          response => {
            this.groupes=response;
          },
          error => {
            console.log(error);
          }
        );
    }

    this.load_project();
  }
  

  load_project(){
    this.authService.inits().subscribe(
      response => {
         this.projet=response.projets2;
         console.log("projets",this.projet);
         this.projet_statistique(this.projet);
       },
      error => {
       }
    );
  }

  to_new(){
    this.router.navigate(['projets/new']);
  }

  to_update_tache(t){
   // console.log(t);
    this.tache_update=t.tache;
    this.tache_update.date=[];
    this.tache_update.date.push(new Date(t.tache.dateDebut));
    this.tache_update.date.push(new Date(t.tache.dateFin));
    
    this.isVisibleTache_Update=true;
  } 

  to_add_tache(p){   
    this.tache_add.phase=p.phase;
    this.tache_add.date.push(new Date());
    this.tache_add.date.push(new Date());
    this.isVisibleTache_Add=true;
  }

  /*to_update_sous_tache(t){
   // console.log(t);
    this.tache_update=t.tache;
    this.tache_update.date=[];
    this.tache_update.date.push(new Date(t.tache.dateDebut));
    this.tache_update.date.push(new Date(t.tache.dateFin));
    
    this.isVisibleTache_Update=true;
  } */

  to_add_sous_tache(p){   
    this.s_tache_add.tache=p.tache; 
    this.isVisible_s_Tache_Add=true;
  } 

  to_update_s_tache(s){
    console.log(s);
    this.s_tache_update=s; 
    this.isVisible_s_Tache_Update=true;
  } 

  to_add_s_tache(){
    this.s_tache_add.tache=this.tache.tache;
    console.log(this.s_tache_add);    
    this.isVisible_s_Tache_Add=true;
  } 

  to_add_phase(){   
    this.phase_add.date.push(new Date());
    this.phase_add.date.push(new Date());
    this.isVisiblePhase_Add=true;
  }

  to_update_phase(t){
   // console.log(t);
    this.phase_update=t.phase;
    this.phase_update.date=[];
    this.phase_update.date.push(new Date(t.phase.dateDebut));
    this.phase_update.date.push(new Date(t.phase.dateFin));
    
    this.isVisiblePhase_Update=true;
  } 


  onChange(result: Date[]): void {  
    //console.log('result: ', result);
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
    console.log(p);
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


  show_affectation(t): void {
    this.task=t;
    this.grps=[];
    this.grp={users:[],
              groupe:{id:0}
              };
    this.eleves=[];
    this.eleve={user1:{}};
    this.eleves_taches = [];

    for(var i=0;i<t.tacheEleves.length;i++){
      for(var j=0;j<this.detail.groupes.length;j++){
        for(var k=0;k<this.detail.groupes[j].users.length;k++){
          if(t.tacheEleves[i].eleve_tache.id==this.detail.groupes[j].users[k].user1.id){
              this.eleves_taches.push({
                  groupe:this.detail.groupes[j].groupe,
                  user:this.detail.groupes[j].users[k].user1
              });
          }
        }  
      }
    }

    console.log("eleves_taches",this.eleves_taches);

    this.grps=this.detail.groupes;
    console.log(this.detail.groupes); 
    console.log(t);
    this.isVisibleAffectations=true; 
  }  

  change_grps(value: string): void {
    //console.log("change") 
    this.eleves=this.grp.users;
    this.eleve={user1:{}};
  }

  delete_eleve_tache(eleve_tache){
    for(var i=0;i<this.eleves_taches.length;i++){
      if(this.eleves_taches[i].groupe.id == eleve_tache.groupe.id && this.eleves_taches[i].user.id == eleve_tache.user.id){
           console.log(this.eleves_taches)
           console.log(eleve_tache)  
           this.eleves_taches.splice(i,1);break;
      }  
    }        
     
  }

  update_eleve_tache(eleve_tache){
     console.log(this.grps)
     console.log(eleve_tache) 
     for(var i=0;i<this.grps.length;i++){
        if(this.grps[i].groupe.id == eleve_tache.groupe.id){
          this.grp=this.grps[i];
          this.eleves=this.grp.users;
          for(var k=0;k<this.eleves.length;k++){
              if(this.eleves[k].user1.id == eleve_tache.user.id){
                this.eleve=this.eleves[k];    
              }

          }
                  

        }  
     }
  }

  change_eleves(value: string): void {
    console.log("grp",this.grp);
    console.log("eleve",this.eleve);
    console.log("eleve",this.eleves_taches);
    var etat=false;
    for(var i=0;i<this.eleves_taches.length;i++){
        if(this.eleves_taches[i].groupe.id==this.grp.groupe.id){
           this.eleves_taches[i].user=this.eleve.user1;
           /*for(var j=0;j<this.grp.users.length;j++){
              if(this.eleves_taches[i].groupe.id==this.grp.users[j].user1.id){
                this.eleves_taches[i].user=this.grp.users[j].user1;
              }
           }*/
           etat=true;break;
        }
    }
    
    if(!etat){
      this.eleves_taches.push({
                  groupe:this.grp.groupe,
                  user:this.eleve.user1
              });
    } 
  }

  tache_eleves(){ 

    this.isVisibleAffectations=false;

    var eleves=[];
    for(var i=0;i<this.eleves_taches.length;i++){
       eleves.push(this.eleves_taches[i].user.id);      
    } 

    console.log(eleves);
    console.log(this.task.tache.id);
    var ff={
    'tache':this.task.tache.id,
    'eleves':eleves
    }
 
    this.authService.tache_eleves(ff).subscribe(
      data => { 
        this.notification.create('success', 'Groupes',
           'modifié avec succès');
        console.log("datadd",data);   
        this.task=data;   

        for(var i=0;i<this.detail.phases.length;i++){
          if(this.detail.phases[i].phase.id==data.tache.phase.id){
            for(var j=0;j<this.detail.phases[i].taches.length;j++){
              if(this.detail.phases[i].taches[j].tache.id==data.tache.id)
              this.detail.phases[i].taches[j]=data;  
            }
          }    
        }  

        //this.load_project();   
      },
      error => { 
        this.notification.create('error', 'Groupes',
           'Erreur de serveur');  
      }
    ); 

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

  export_zip(x): void {
    this.authService.export_zip(1).subscribe(
          data => {
             this.notification.create('success', 'Document',
               'ajouté avec succès');   
          },
          error => {
            this.notification.create('error', 'Document',
               'Erreur de serveur');  
          }
        );
  }

  delete_production(production){ 
    //console.log(production);
    //console.log(this.tache.productionTaches);
    this.formData=new FormData();
    this.formData.append('id', production.id);
    this.authService.production_delete(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Production',
               'supprimée avec succès');
            for(var i=0;i<this.tache.productionTaches.length;i++){
              if(this.tache.productionTaches[i].id==production.id){
                this.tache.productionTaches.splice(i,1);
              }
            	
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
        //console.log("productionTaches",tache.productionTaches[i]);
        return tache.productionTaches[i];
      }
    }
    return null;
  }
  
  get_production(tache){  
    //console.log("tache",tache);
    for(var i=0;i<tache.productionTaches.length;i++){
      if(tache.productionTaches[i].tache1.id==tache.tache.id && this.groupe_eleve(this.detail,this.user).id==this.groupe_eleve(this.detail,tache.productionTaches[i].eleve).id){ 
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

  groupe_eleve(projet,user){
     for(var i=0;i<projet.groupes.length;i++){
        for(var j=0;j<projet.groupes[i].users.length;j++){
          if(projet.groupes[i].users[j].user1.id==user.id){
            return projet.groupes[i].groupe;
          }
       }  
     }
     return {id:0};
  } 
  
  productions=[];
  show_productions(tache){
    // console.log(tache);
     this.isVisibleProd=true; 
     this.productions=tache.productionTaches;
  } 
//ajouter phase
 
ajouter_phase(){ 
    this.isVisiblePhase_Add = false; 
    var phase= {'projet':this.detail.projet.id,
                'nom':this.phase_add.nom,
                'description':this.phase_add.description,
                'dd':this.phase_add.date[0],
                'df':this.phase_add.date[1] };
    this.authService.add_phase(phase).subscribe(
          data => { 
            console.log("data",data);
            this.notification.create('success', 'Phase',
               'ajouté avec succès');
            this.detail.phases.push(data);     
            this.projet_statistique(this.projet);

          },
          error => { 
            this.notification.create('error', 'Phase',
               'Erreur de serveur');  
          }
        );
}

update_phase(){ 
    this.isVisiblePhase_Update = false; 
    console.log(this.phase_update);
    var phase= {'projet':this.phase_update.id,
                'nom':this.phase_update.nom,
                'description':this.phase_update.description,
                'dd':this.phase_update.date[0],
                'df':this.phase_update.date[1] };
    this.authService.update_phase(phase).subscribe(
          data => {  

            this.notification.create('success', 'Phase',
               'modifié avec succès');
            for(var i=0;i<this.detail.phases.length;i++){
              if(this.detail.phases[i].phase.id==data.phase.id)
               this.detail.phases[i]=data;
            }     
            this.projet_statistique(this.projet);   
          },
          error => { 
            this.notification.create('error', 'Phase',
               'Erreur de serveur');  
          }
        ); 
}

delete_phase(p){  
    console.log(p);
    this.formData=new FormData();
    this.formData.append('id', p.phase.id);
    this.authService.delete_phase(this.formData).subscribe(
          data => { 
            console.log("data",data);
            this.notification.create('success', 'Phase',
               'supprimé avec succès');
            for(var i=0;i<this.detail.phases.length;i++){
              if(this.detail.phases[i].phase.id==p.phase.id)
               this.detail.phases.splice(i,1);
            }     
            this.projet_statistique(this.projet);   
          },
          error => { 
            this.notification.create('error', 'Phase',
               'Erreur de serveur');  
          }
        ); 
}
 
ajouter_s_tache(p){ 
    this.isVisible_s_Tache_Add = false; 
    console.log(p);
    var tache= {'tache':p.tache.id,
                'nom':p.nom,
                'description':p.description};
    this.authService.add_sous_tache(tache).subscribe(
          data => { 
             console.log("tache",data);
            //console.log("detail",this.detail);
            /*data.productionTaches=[];
            data.sousTaches=[];
            data.tacheEleves=[];*/
            this.notification.create('success', 'Sous tache',
               'ajouté avec succès');
             
            this.tache.sousTaches=data.sousTaches; 
            this.projet_statistique(this.projet);

          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        );
}

modifier_s_tache(p){ 
    this.isVisible_s_Tache_Update = false; 
    console.log(p);
    console.log(this.tache);
    
    var tache= {'tache':p.id,
                'nom':p.nom,
                'description':p.description};
    this.authService.update_sous_tache(tache).subscribe(
          data => {  
            this.notification.create('success', 'Sous tache',
               'modifié avec succès');
             
            this.tache.sousTaches=data.sousTaches; 
            this.projet_statistique(this.projet);

          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        );
}


delete_sous_tache(p){  
    console.log(p);
    console.log(this.tache);
    this.formData=new FormData();
    this.formData.append('id', p.id);
    this.authService.delete_sous_tache(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Sous tache',
               'supprimé avec succès');
            for(var i=0;i<this.tache.sousTaches.length;i++){ 
                if(this.tache.sousTaches[i].id==p.id){
                  this.tache.sousTaches.splice(i,1);break;
                }
            }     
            this.projet_statistique(this.projet);
          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        ); 
}


add_tache(p){ 
    this.isVisibleTache_Add = false; 
    console.log(p);
    var tache= {'phase':p.phase.id,
                'nom':this.tache_add.nom,
                'description':this.tache_add.description,
                'dd':this.tache_add.date[0],
                'df':this.tache_add.date[1] };
    this.authService.add_tache(tache).subscribe(
          data => { 
             console.log("tache",data);
            //console.log("detail",this.detail);
            data.productionTaches=[];
            data.sousTaches=[];
            data.tacheEleves=[];
            this.notification.create('success', 'Tache',
               'ajouté avec succès');
             
            for(var i=0;i<this.detail.phases.length;i++){ 
                if(this.detail.phases[i].phase.id==data.tache.phase.id){
                     console.log("result",this.detail.phases[i]);
                     this.detail.phases[i].taches.push(data);
                } 
            } 

            this.projet_statistique(this.projet);

          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        );
}

update_tache(p){ 
    this.isVisibleTache_Update = false; 
    console.log(p);
    var tache= {'phase':this.tache_update.id,
                'nom':this.tache_update.nom,
                'description':this.tache_update.description,
                'dd':this.tache_update.date[0],
                'df':this.tache_update.date[1] };
    this.authService.update_tache(tache).subscribe(
          data => { 
            console.log("data",data);
            this.notification.create('success', 'Tache',
               'modifié avec succès');
            for(var i=0;i<this.detail.phases.length;i++){
                for(var j=0;j<this.detail.phases[i].taches.length;j++){
                  if(this.detail.phases[i].taches[j].tache.id==data.tache.id)
                  this.detail.phases[i].taches[j]=data;  
                }
              
            }     
            this.projet_statistique(this.projet);   
          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        ); 
}

delete_tache(p){  
    
    this.formData=new FormData();
    this.formData.append('id', p.tache.id);
    this.authService.delete_tache(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Tache',
               'supprimé avec succès');
            for(var i=0;i<this.detail.phases.length;i++){
              for(var j=0;j<this.detail.phases[i].taches.length;j++){
                console.log(this.detail.phases[i].taches[j]);
                console.log(p);
                if(this.detail.phases[i].taches[j].tache.id==p.tache.id)
                  this.detail.phases[i].taches.splice(i,1);break;
              }
            }     
            this.projet_statistique(this.projet);
          },
          error => { 
            this.notification.create('error', 'Tache',
               'Erreur de serveur');  
          }
        );  
}

to_update_projet(p){
  this.isVisibleProjet_Update = true; 
  
  p.nom=p.projet.nom;
  p.description=p.projet.description;
  p.date=[];
  p.date.push(new Date(p.projet.dateDebut));
  p.date.push(new Date(p.projet.dateFin));

  this.projet_update = p;
  console.log(p);
}
update_projet(){ 
    this.isVisibleProjet_Update = false; 
    console.log(this.projet_update);
    var projet= {'projet':this.projet_update.projet.id,
                'nom':this.projet_update.nom,
                'description':this.projet_update.description,
                'dd':this.projet_update.date[0],
                'df':this.projet_update.date[1] };
    this.authService.update_projet(projet).subscribe(
          data => { 
            console.log("data",data);
            this.notification.create('success', 'Projet',
               'modifié avec succès');
            this.load_project();
          },

          error => { 
            this.notification.create('error', 'Projet',
               'Erreur de serveur');  
          }
        ); 
}

delete_projet(p){  

    
    this.formData=new FormData();
    this.formData.append('id', p.projet.id);
    this.authService.delete_projet(this.formData).subscribe(
          data => { 
            this.notification.create('success', 'Projet',
               'supprimé avec succès');
            for(var i=0;i<this.projet.length;i++){
                console.log(this.projet[i].projet);
                console.log(p.projet); 
                if(this.projet[i].projet.id==p.projet.id){
                  this.projet.splice(i,1);break;
                }
            }     
            this.projet_statistique(this.projet);
          },
          error => { 
            this.notification.create('error', 'Projet',
               'Erreur de serveur');  
          }
        );  
}


show_groupes(p){
  this.isVisibleGroupe_Update=true; 
  this.groupes_selected = [];
  this.groupes_selected = [];
  this.projet_groupe=p;
  for(var i=0;i<p.groupes.length;i++){ 
    for(var j=0;j<this.groupes.length;j++){
        if(p.groupes[i].groupe.id==this.groupes[j].id){
           this.groupes_selected.push(this.groupes[j].id);
        }
    }
  } 
 
}

update_groupes(){
    var new_groupes=[];
    var old_groupes=[];
    this.isVisibleGroupe_Update=false; 

    var etat=true;
    for(var i=0;i<this.projet_groupe.groupes.length;i++){ 
      etat=true;
      for(var j=0;j<this.groupes_selected.length;j++){
          if(this.projet_groupe.groupes[i].groupe.id==this.groupes_selected[j]){
             etat=false;break;
          } 
      }
      if(etat){
        old_groupes.push(this.projet_groupe.groupes[i].groupe.id);
      }
    }

    for(var j=0;j<this.groupes_selected.length;j++){ 
      etat=true;
      for(var i=0;i<this.projet_groupe.groupes.length;i++){
          if(this.projet_groupe.groupes[i].groupe.id==this.groupes_selected[j]){
             etat=false;break;
          } 
      }
      if(etat){
        new_groupes.push(this.groupes_selected[j]);
      }
    } 

    /* this.formData=new FormData();
    this.formData.append('projet', this.projet_groupe.projet.id);
    this.formData.append('groupes_deleted', old_groupes);
    this.formData.append('groupes_added', new_groupes);*/
    var dd={
          'projet':this.projet_groupe.projet.id,
          'groupes_deleted':old_groupes,
          'groupes_added':new_groupes
    }

    this.authService.projet_groupes(dd).subscribe(
      data => { 
        this.notification.create('success', 'Groupes',
           'modifié avec succès');
        this.load_project();   
      },
      error => { 
        this.notification.create('error', 'Groupes',
           'Erreur de serveur');  
      }
    ); 
}
  

}
