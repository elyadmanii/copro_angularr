import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import {Router} from "@angular/router"
import { AuthLoginInfo } from '../auth/login-info';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzNotificationService,NzMessageService } from 'ng-zorro-antd';

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
  isLoading:boolean=false;
  
  submitForm(x): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    this.onSubmit(x);
    //console.log(x);
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
}
