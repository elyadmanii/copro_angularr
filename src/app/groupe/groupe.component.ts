import { Component, OnInit } from '@angular/core';
import { InitAppService } from '../services/init.service';
import { AuthService } from '../auth/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.css']
})
export class GroupeComponent implements OnInit {

  user: any; 
  groupes= [];
  user_modal= <any>{};
  fileList = [];
  files = [];
  message:string ="";
  subject:string ="";
  isVisible:boolean=false;
  formData:FormData = new FormData();

  constructor(private token: TokenStorageService,
  			  private init: InitAppService,
  			  private authService: AuthService,
  			  private msg: NzMessageService,
          private notification: NzNotificationService,
              public g_var: Global_varService) { }


  ngOnInit() { 
  	this.user=this.token.getUser();
    this.authService.groupes().subscribe(
      response => {
        this.groupes=response;
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  } 

  showModal(u): void {
    this.isVisible = true;
    this.user_modal = u; 
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  isOkLoading:boolean=false;
  handleOk(): void {
    this.isOkLoading=true; 
    this.formData.append('email', this.user_modal.email);
    this.formData.append('subject', this.subject);
    this.formData.append('msg', this.message);
    /*this.formData.append('nbr', this.files.length);
    this.formData.append('files', this.files);*/
    
     this.authService.sendmail(this.formData).subscribe(
      response => {
         this.isVisible = false;
         this.subject= "";
		     this.message= "";
         this.notification.create('success', 'Email',
               'envoyé avec succès'); 
         this.isOkLoading=false;       
      },
      error => {
         this.isVisible = false;
         this.subject= "";
		     this.message= "";
         this.notification.create('error', 'Email',
               'Erreur de serveur');
         this.isOkLoading=false;      
      }
    );
     
  }

  handleChange({ file, fileList }): void {
    this.files=[];
    for(var i=0;i<fileList.length;i++){
     	console.log(fileList[i]);
     	this.files.push(fileList[i].originFileObj);
    }
  } 

  

}
