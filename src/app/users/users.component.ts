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
  signupInfo: SignUpInfo;
  errorMessage = '';
  data = [];
  displayData = [ ...this.data ];

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

    this.load();
  }

  load(): void {
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

  handleOk(val): void {
      this.isConfirmLoading = true;
       
      this.signupInfo = new SignUpInfo(
      val.name,
      val.lastName,
      val.nickname,
      val.email,
      val.password);
 


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
 	      }
	    );

          
  }
 
}

