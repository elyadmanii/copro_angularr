import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthService } from '../auth/auth.service';
import {AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { Global_varService } from '../services/global_var.service';

 
@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  
  user: any;
  user_chat: any={user1:0,user2:0};
  groupe_chat: any={groupe:{id:0}};
  users:any= [];
  groupes:any= [];
  chats= [];
  chats_groupes= [];
  view:boolean=true;
  
  
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;

  itemsGrp: AngularFireList<any>;
  items_groupes: Observable<any[]>;

  constructor(db: AngularFireDatabase,
               private token: TokenStorageService,
               private authService: AuthService,
               public g_var: Global_varService) {

    this.itemsRef = db.list('chats');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.itemsRef.valueChanges().subscribe(p =>{this.chats=p;});

    this.itemsGrp = db.list('chats_groupes');
    this.items_groupes = this.itemsGrp.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.itemsGrp.valueChanges().subscribe(p =>{this.chats_groupes=p;});

  }

  load(): void {
    this.authService.users().subscribe(
	      response => {
	        console.log(response);
	        this.users = response;
	      },
	      error => {
	        console.log(error);
 	      }
	    );

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

  ngOnInit() {
    this.user=this.token.getUser();
    this.load();
  }
  
  switch_user(u): void {  
      this.user_chat=u;
      var etat=true;
      for(var i=0;i<this.chats.length;i++){
        if((this.user.id==this.chats[i].user1||this.user.id==this.chats[i].user2) && 
           (this.user_chat.id==this.chats[i].user2||this.user_chat.id==this.chats[i].user1)){
          etat=false;break;
        }
      }
      if(etat){
          this.itemsRef.push({user1:this.user.id,user2:u.id});
      }
    
  }

  switch_groupe(g): void {  
      this.groupe_chat=g; 
      console.log(this.groupe_chat);
      var etat=true;
      for(var i=0;i<this.chats_groupes.length;i++){
        if(this.groupe_chat.groupe.id==this.chats_groupes[i].id){
          etat=false;break;
        }
      }
      if(etat){
          this.itemsGrp.push({id:this.groupe_chat.groupe.id});
      }
    
  }

  add_msg_groupe(msg,key,item): void {
    if(item.msgs){
      item.msgs.push({
                 id:this.user.id,
                 name:this.user.lastName+" "+this.user.name,
                 msg:msg,
                 date:new Date().getTime()
             });
    }else{
      item.msgs=[{
                 id:this.user.id,
                 name:this.user.lastName+" "+this.user.name,
                 msg:msg,
                 date:new Date().getTime()
             }]; 
    }
    
    item.msg="";            
    this.itemsGrp.update(key,item);
    
  }

  add_msg(msg,key,item): void {
    if(item.msgs){
      item.msgs.push({
                 id:this.user.id,
                 msg:msg,
                 date:new Date().getTime()
             });
    }else{
      item.msgs=[{
                 id:this.user.id,
                 msg:msg,
                 date:new Date().getTime()
             }]; 
    }
    
    item.msg="";            
    this.itemsRef.update(key,item);
    
  }

  desc = (a, b) => {
    if(a.key < b.key) return b.key;
  }
  
  /*reverseKeyOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  valueOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.value.localeCompare(b.value);
  }*/

}
