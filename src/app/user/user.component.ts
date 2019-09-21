import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Global_varService } from '../services/global_var.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  board: string;
  errorMessage: string;
  fileUploads: Observable<string[]>;
  user: any;
  user_update: any;
  authority:string="";
  roles= [];

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private msg: NzMessageService,
              private authService: AuthService,
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
    this.user_update={
      id:this.user.id,
      lastName:this.user.lastName,
      name:this.user.name,
      email:this.user.email,
      username:this.user.username,
      password:""
     }
    console.log('user',this.user); 
    console.log('user',this.user_update);   
    this.load();
  }

  load(): void {
    /*this.authService.projets().subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );*/

      this.authService.inits().subscribe(
        response => {
          console.log("init");
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
 }

  

  loading = false;
  avatarUrl: string;
  formData:FormData = new FormData();
  readytoupload:boolean=false;

  fileChange(event) {
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];    
    this.formData.append('file', file);
    this.readytoupload =true;
  }
  upload_profil(){
       if(this.readytoupload){
         this.authService.profile(this.formData).subscribe(
          data => {
            this.notification.create('success', 'Élève',
               'ajouté avec succès'); 
              
          },
          error => {
            console.log(error);
            this.notification.create('error', 'Élève',
               'Erreur de serveur');  
          }
        );
       }
  }   

  isVisible = false;
  isConfirmLoading = false;

  isVisibleInfo = false;
  isVisiblePasse = false;
  mp_a="";
  mp_n="";
  mp_c="";
  etat_password = false;

  showModal(): void {
    this.isVisible = true;
    this.fileList=[];
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  fileList = [];
  previewImage = '';
  previewVisible = false;
 

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.thumbUrl;
    this.previewVisible = true;
  }

  
  handleOk(): void {
    this.isVisible = false;
    console.log(this.fileList[0].originFileObj);
    this.formData.append('file', this.fileList[0].originFileObj);
    this.authService.profile(this.formData).subscribe(
          data => {
            this.fileList=[];
            this.formData=new FormData();
            this.notification.create('success', 'Image',
               'ajouté avec succès');  
            this.g_var.timer=new Date().getTime();    
          },
          error => {
            this.fileList=[];  
            this.formData=new FormData();
            this.notification.create('error', 'Image',
               'Erreur de serveur');  
          }
        );
  }
  
  modifier_password():void{
  
  }

  verifier_password(x):void{
  
    this.authService.verifier_password(this.user.id,x).subscribe(
      data => {
          console.log(data);
          this.etat_password=data;
      },
      error => {
         
      }
    ); 

  }

  modifier1():void{
      console.log("sf");
      console.log(this.user_update);
      this.formData=new FormData();
      this.formData.append('id', this.user_update.id);
      this.formData.append('email', this.user_update.email);
      this.formData.append('lastName', this.user_update.lastName);
      this.formData.append('name', this.user_update.name);
      this.formData.append('username', this.user_update.username);
      this.formData.append('password', this.user_update.password);
 
      
      this.authService.modifier_info(this.formData).subscribe(
        data => {
          console.log(data);
          this.errorMessage='';
  
          this.isVisibleInfo = false;
          this.isConfirmLoading = false;
           this.notification.create('success', 'Infos',
             'modifié avec succès');  
        },
        error => {
          console.log(error);
          this.isConfirmLoading = false;
          this.errorMessage = error.error.message;
          this.notification.create('error', 'Infos',
             'Erreur de serveur');  
        }
      );


  }


}
