import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import {Router} from "@angular/router"
import { AuthLoginInfo } from '../auth/login-info';
import { NzNotificationService,NzMessageService } from 'ng-zorro-antd';
 
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { SignUpInfo } from '../auth/signup-info'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
 
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;
  validateForm: FormGroup;
  fp: FormGroup;
  isLoading:boolean=false;
  user_id:number=0;
  signupInfo: SignUpInfo;
  
  submitForm(x): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    this.onSubmit(x); 
  }

  submitFp(): void {
    for (const i in this.fp.controls) {
      this.fp.controls[ i ].markAsDirty();
      this.fp.controls[ i ].updateValueAndValidity();
    }
  }

  confirmationValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.fp.controls.password.value) {
      return { confirm: true, error: true };
    }
  };

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.fp.controls.checkPassword.updateValueAndValidity());
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService, 
              private tokenStorage: TokenStorageService,
              private router: Router,
              private msg: NzMessageService,
              private notification: NzNotificationService) { }

  ngOnInit() {
 
    if(this.tokenStorage.isAuth()){
       this.router.navigate(['home']);
    }

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }
    this.validateForm = this.fb.group({
      username: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });

    this.fp = this.fb.group({
      email            : [ null, [ Validators.email, Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      nickname         : [ null, [ Validators.required ] ],
      name         : [ null, [ Validators.required ] ],
      lastName         : [ null, [ Validators.required ] ]
    });

  }

  onSubmit(x) {
    

    this.loginInfo = new AuthLoginInfo(
      x.username,
      x.password);
     console.log(this.loginInfo); 
    this.isLoading=true;
    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.tokenStorage.saveUser(data.user);
        this.tokenStorage.isconnect=true;
        
        console.log(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.isLoading=false;
        this.router.navigate(['home']);
        //this.reloadPage();
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
        this.isLoading=false;
        this.notification.create('error', 'Connexion','UserName ou mot de passe incorrect');
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

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

  handleOk(val): void {
      this.isConfirmLoading = true;
       
      this.signupInfo = new SignUpInfo(
                      0,
                      val.name,
                      val.lastName,
                      val.nickname,
                      val.email,
                      val.password);
       
          this.authService.add_professeur(this.signupInfo).subscribe(
            data => {
            console.log(data);
            this.errorMessage='';
    
            this.isVisible = false;
              this.isConfirmLoading = false;
              this.notification.create('success', 'Professeur',
               'ajouté avec succès');  
            },
            error => {
              console.log(error);
              this.isConfirmLoading = false;
              this.errorMessage = error.error.message;
              this.notification.create('error', 'Professeur',
                 'Erreur de serveur');  
            }
            );
          
  }

}
