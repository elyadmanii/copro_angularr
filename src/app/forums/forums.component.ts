import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { TokenStorageService } from '../auth/token-storage.service';
import { Global_varService } from '../services/global_var.service';



@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  
  validateForm: FormGroup;
  user: any;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
  }

  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(private fb: FormBuilder,db: AngularFireDatabase,
              private notification: NzNotificationService,private nzMessageService: NzMessageService,private token: TokenStorageService,public g_var: Global_varService) {

    this.itemsRef = db.list('messages');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
     
  
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      forum: [ null, [ Validators.required ] ]
    });
    /*this.user = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };*/
    this.user=this.token.getUser();
  }

   


  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
  }
  updateItem(key: string, newText: string) {
    this.itemsRef.update(key, { text: newText });
  }

  updateMsgItem(to_update,item,key) {
    item.msg=to_update;
    this.itemsRef.update(key,item);
    this.notification.create('success', 'Forum',
      'modifié avec succès');
  }

  updateCommentItem(to_update_comment,item,key,value) {
    value.msg=to_update_comment;
    this.itemsRef.update(key,item);
    this.notification.create('success', 'Commentaire',
      'modifié avec succès');
  }
 
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }




  isVisible = false;
  isConfirmLoading = false;
 
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(val): void {
    this.isConfirmLoading = true;
    
      this.isVisible = false;
      this.isConfirmLoading = false;
      
      var f={user:this.user.name+' '+this.user.lastName,
                 id:this.user.id,
                 msg:val.forum,
                 date:new Date().getTime(),
                 reponse:[{reponse:[]}]
                 };
      //console.log(f);           
      this.itemsRef.push(f);   
      this.notification.create('success', 'Forum',
      'ajouté avec succès');  
            
    
  }

  
  delete_forum(key: string) {
    this.itemsRef.remove(key);
    this.notification.create('success', 'Forum',
      'supprimé avec succès'); 
  }

  delete_comment(key: string,item,reponse,k) {
    
    /*for(var i=0;i<item.reponses.length;i++){
       if(item.reponses[i].date==reponse.value.date){
        item.reponses.splice(k,1);
        this.itemsRef.update(key,item);
        break;
      }
    }*/

    item.reponses.splice(k,1);
    this.itemsRef.update(key,item);
    console.log(k);
    //console.log(item);

    
    this.notification.create('success', 'Commentaire',
      'supprimée avec succès'); 
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  add_comment(comment,key,item): void {
    if(item.reponses){
      item.reponses.push({user:this.user.name+' '+this.user.lastName,
                 id:this.user.id,
                 msg:comment,
                 date:new Date().getTime()
             });
    }else{
      item.reponses=[{user:this.user.name+' '+this.user.lastName,
                 id:this.user.id,
                 msg:comment,
                 date:new Date().getTime()
             }]; 
    }
    
    item.comment="";            
    //item.reponses.push();
    this.itemsRef.update(key,item);
    this.notification.create('success', 'Commentaire',
      'ajouté avec succès'); 
  }
  
  add_reponse(item,key,reponse): void {
  
    if(item.reponses[reponse.key].reponses){
      item.reponses[reponse.key].reponses.push({user:this.user.name+' '+this.user.lastName,
                id:this.user.id,
                 msg:reponse.reponse,
                 date:new Date().getTime()
             });
    }else{
      item.reponses[reponse.key].reponses=[{user:this.user.name+' '+this.user.lastName,
                 id:this.user.id,
                 msg:reponse.reponse,
                 date:new Date().getTime()
             }]; 
    }
    reponse.reponse="";            
    this.itemsRef.update(key,item);
    this.notification.create('success', 'Reponse',
      'ajouté avec succès'); 

  }
  
  show_comment(item): void {
    console.log(this.items);
    item.show=!item.show;
  }

  

  

}
