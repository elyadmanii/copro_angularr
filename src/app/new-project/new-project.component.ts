import { Component, OnInit } from '@angular/core';
import { InitAppService } from '../services/init.service';
import { AuthService } from '../auth/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
 
  user: any;
  nom: any;
  description: any;
  date= {};
  
  groupes = [];
  groupes_selected = [];

  isVisible:boolean=false;
  isVisibleTache:boolean=false;
 

  phase={
    id:0,
    active: false,
    nom:"",
    description:"",
    date:{},
    taches:[]
  }
  tache={ 
    id:0,
    nom:"",
    description:"",
    date:{},
    sous_taches:[]
  }

  phases = [];


  constructor(private token: TokenStorageService,
      			  private init: InitAppService,
      			  private authService: AuthService,
      			  private msg: NzMessageService,
              private notification: NzNotificationService) { }

  ngOnInit() { 
  	this.user=this.token.getUser();
    this.authService.groupes_prof().subscribe(
      response => {
        this.groupes=response;
      },
      error => {
        console.log(error);
      }
    );
 
  }

  add_project() {
   
      var phs=[];
      for(var i=0;i<this.phases.length;i++){
         var ths=[];
         for(var j=0;j<this.phases[i].taches.length;j++){
          ths.push({nom:this.phases[i].taches[j].nom,
                    description:this.phases[i].taches[j].description,
                    date_debut:this.phases[i].taches[j].date[0],
                    date_fin:this.phases[i].taches[j].date[1]});
         }
        phs.push({nom:this.phases[i].nom,
                  description:this.phases[i].description,
                  date_debut:this.phases[i].date[0],
                  date_fin:this.phases[i].date[1],
                  taches:ths}); 
      }

      var grps=[];
      for(var i=0;i<this.groupes_selected.length;i++){
          grps.push(this.groupes_selected[i]);
      }
      

      var dd={nom:this.nom,
              description:this.description,
              date_debut:this.date[0],
              date_fin:this.date[1],
              phases:phs,
              groupes:grps};
      console.log(dd);
      console.log(this.groupes_selected); 
 
      this.authService.add_project(dd).subscribe(
        data => { 

           this.notification.create('success', 'Projet',
             'ajouté avec succès');  
        },
        error => { 
          this.notification.create('error', 'Projet',
             'Erreur de serveur');  
        }
      );


  }

  ajouter_phase() {
    this.phase.id=this.phases.length+1;
    this.phases.push(this.phase);
    this.isVisible=false;
    console.log(this.phases);
    this.phase={
      id:0,
      active: false,
      nom:"",
      description:"",
      date:{},
      taches:[]
    }
  }

  ajouter_tache() {
    for(var i=0;i<this.phases.length;i++){
      if(this.phases[i].id==this.phase.id){
        this.phase.id=this.phases.length+1;
        this.phases[i].taches.push(this.tache);
      }
    }
    this.isVisibleTache = false;

  }
  

  onChange(result: Date[]): void { 
    console.log('date: ', this.date);
    console.log('result: ', result);
  }

  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
 
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }


  showModal(): void {
    this.isVisible = true;
    this.phase={
      id:0,
      active: false,
      nom:"",
      description:"",
      date:{},
      taches:[]
    }
    console.log("phase");

  }
  
  handleCancel(): void {
    this.isVisible = false;
  }
 
  showModalTache(p): void {
    console.log("tache");
    this.phase = p;
    this.isVisibleTache = true;
    this.tache={ 
      id:0,
      nom:"",
      description:"",
      date:{},
      sous_taches:[]
    }
  }
 
  cancel_tache(): void {
    this.isVisibleTache = false;
  }

}
