import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthService } from '../auth/auth.service';
import { SignUpInfo } from '../auth/signup-info'; 


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
   
  validateForm: FormGroup;
  user: any;
  user_id: number=0;
  signupInfo: SignUpInfo;
  formData:FormData = new FormData();
  errorMessage = '';
  data = [];
  displayData = [ ...this.data ];
  authority:string="";
  roles= [];

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
  }

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private notification: NzNotificationService,
              private nzMessageService: NzMessageService,
              private token: TokenStorageService,
              private authService: AuthService) { }

  ngOnInit() {
     
 
    this.validateForm = this.fb.group({
      email            : [ null, [ Validators.email, Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      nickname         : [ null, [ Validators.required ] ],
      name         : [ null, [ Validators.required ] ],
      lastName         : [ null, [ Validators.required ] ]
    });

    this.user = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };

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

    this.load();
  }

  load(): void {
    if (this.authority == 'professeur') {
      this.authService.eleves().subscribe(
	      response => {
	        console.log(response); 
	        this.data = response;
          this.displayData = [ ...this.data ];
	      },
	      error => {
	        console.log(error);
 	      }
	    );
    }  

    if (this.authority == 'admin') {
      this.authService.professeurs().subscribe(
        response => { 
          this.data = response;
          for(var i=0;i<this.data.length;i++){
            if(this.data[i].username=="test"){
              this.data.splice(i,1);break;
            }
          }

          for(var i=0;i<this.data.length;i++){
            if(this.data[i].username=="admin"){
              this.data.splice(i,1);break;
            }
          }

          this.displayData = [ ...this.data ];
        },
        error => {
          console.log(error);
        }
      );
    }  
  }  

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };


  isVisible = false;
  isConfirmLoading = false;
 
  showModal(): void {
    this.isVisible = true;
    this.user_id=0;
    this.validateForm.patchValue({
      name:'',
      lastName:'',
      nickname:'',
      email:'',
      password:'',
      checkPassword:''
    });
  }

  to_update(u): void {
    console.log(u);
    this.isVisible = true; 
    this.user_id=u.id;
    this.validateForm.patchValue({
      name:u.name,
      lastName:u.lastName,
      nickname:u.username,
      email:u.email,
      password:'',
      checkPassword:''
    }); 
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  nameList = [
    { text: 'Joe', value: 'Joe' },
    { text: 'Jim', value: 'Jim' }
  ];
  addressList = [
    { text: 'London', value: 'London' },
    { text: 'Sidney', value: 'Sidney' }
  ];
  sortName = null;
  sortValue = null;
  listOfSearchName = [];
  searchAddress: string;
   

  sort(sort: { key: string, value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
  }

  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
  }
  delete_user(u): void {
    console.log(u);
    this.formData=new FormData();
    this.formData.append('id', u.id);
    this.authService.delete_user(this.formData).subscribe(
    data => { 
        this.notification.create('success', 'Utilisateur',
           'supprimée avec succès');
        this.load();
      },
      error => { 
        this.notification.create('error', 'Eleve',
           'Erreur de serveur');  
      }
    );
  }

  handleOk(val): void {
      this.isConfirmLoading = true;
       
      this.signupInfo = new SignUpInfo(
      this.user_id,
      val.name,
      val.lastName,
      val.nickname,
      val.email,
      val.password);
      
      if(this.user_id==0){

         if (this.authority == 'admin') {
            this.authService.add_professeur(this.signupInfo).subscribe(
            data => {
            console.log(data);
            this.errorMessage='';
    
            this.isVisible = false;
              this.isConfirmLoading = false;
              this.load();
              this.notification.create('success', 'Professeur',
               'ajouté avec succès');  
            },
            error => {
              console.log(error);
              this.isConfirmLoading = false;
              this.errorMessage = error.error.message;
              this.notification.create('error', 'Professeur',
                 'Erreur de serveur');  
            });
         }

         if (this.authority == 'professeur') {
            this.authService.signUp(this.signupInfo).subscribe(
            data => {
            console.log(data);
            this.errorMessage='';
    
            this.isVisible = false;
              this.isConfirmLoading = false;
              this.load();
              this.notification.create('success', 'Élève',
               'ajouté avec succès');  
            },
            error => {
              console.log(error);
              this.isConfirmLoading = false;
              this.errorMessage = error.error.message;
              this.notification.create('error', 'Élève',
                 'Erreur de serveur');  
            });
 
         }
          
      }else{
          this.authService.update_user(this.signupInfo).subscribe(
            data => {
            console.log(data);
            this.errorMessage='';
    
            this.isVisible = false;
              this.isConfirmLoading = false;
              this.load();
              this.notification.create('success', 'Élève',
               'modifié avec succès');  
            },
            error => {
              console.log(error);
              this.isConfirmLoading = false;
              this.errorMessage = error.error.message;
              this.notification.create('error', 'Élève',
                 'Erreur de serveur');  
            }
            );
      }
	    

          
  }
 
}

