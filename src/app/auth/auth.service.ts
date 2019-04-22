import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtResponse } from './jwt-response';
import { AuthLoginInfo } from './login-info';
import { SignUpInfo } from './signup-info';
import { Global_varService } from '../services/global_var.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private g_var: Global_varService) {
  }
 
  private loginUrl = this.g_var.url+'api/auth/signin';
  private signupUrl = this.g_var.url+'api/auth/signup';
  private elevesUrl = this.g_var.url+'api/auth/liste_eleves';
  private professeursUrl = this.g_var.url+'api/auth/liste_professeurs';
  private usersUrl = this.g_var.url+'api/auth/all_users';
  private profileUrl = this.g_var.url+'api/auth/profile';
  private filesUrl = this.g_var.url+'api/auth/getallfiles';
  private projetsUrl = this.g_var.url+'api/projet/all';
  private initUrl = this.g_var.url+'api/auth/init';
  private production_tacheUrl = this.g_var.url+'api/auth/production_tache';
  private document_projetUrl = this.g_var.url+'api/auth/document_projet';
  private delete_production_tacheUrl = this.g_var.url+'api/auth/delete_production_tache';
  private mes_groupes_tacheUrl = this.g_var.url+'api/auth/mes_groupes';
  private sendmailUrl = this.g_var.url+'api/auth/sendmail';
  private groupesUrl = this.g_var.url+'api/auth/groupes';
  private modifier_infoUrl = this.g_var.url+'api/auth/modifier_info';
  private verifier_password_infoUrl = this.g_var.url+'api/auth/verify_passe';
  private add_project_infoUrl = this.g_var.url+'api/auth/add_project';
  private add_groupe_infoUrl = this.g_var.url+'api/auth/add_groupe';
  private update_groupe_infoUrl = this.g_var.url+'api/auth/update_groupe';
  private delete_groupe_infoUrl = this.g_var.url+'api/auth/delete_groupe';

  private delete_user_infoUrl = this.g_var.url+'api/auth/delete_user';
  private update_user_infoUrl = this.g_var.url+'api/auth/update_user';
  private add_professeur_infoUrl = this.g_var.url+'api/auth/add_professeur';
  

  private gestion_groupesUrl = this.g_var.url+'api/auth/gestion_groupes';
  private delete_documentUrl = this.g_var.url+'api/auth/delete_document_projet';
  private add_phaseUrl = this.g_var.url+'api/auth/add_phase';
  private update_phaseUrl = this.g_var.url+'api/auth/update_phase';
  private delete_phaseUrl = this.g_var.url+'api/auth/delete_phase';

  private add_tacheUrl = this.g_var.url+'api/auth/add_tache';
  private update_tacheUrl = this.g_var.url+'api/auth/update_tache';
  private delete_tacheUrl = this.g_var.url+'api/auth/delete_tache';

  private add_sous_tacheUrl = this.g_var.url+'api/auth/add_sous_tache';
  private update_sous_tacheUrl = this.g_var.url+'api/auth/update_sous_tache';
  private delete_sous_tacheUrl = this.g_var.url+'api/auth/delete_sous_tache';

  private update_projetUrl = this.g_var.url+'api/auth/update_projet';
  private delete_projetUrl = this.g_var.url+'api/auth/delete_projet';

  private projet_groupesUrl = this.g_var.url+'api/auth/projet_groupes';

  private tache_elevesUrl = this.g_var.url+'api/auth/tache_eleves';
  private export_zipUrl = this.g_var.url+'api/auth/exportProject';
  

  
  
  
 

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }

  signUp(info: SignUpInfo): Observable<any> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }

  add_project(info: any): Observable<any> {
    return this.http.post<string>(this.add_project_infoUrl, info, httpOptions);
  }
  
  tache_eleves(info: any): Observable<any> {
    return this.http.post<string>(this.tache_elevesUrl, info);
  }

  add_phase(info: any): Observable<any> {
    return this.http.post<string>(this.add_phaseUrl, info);
  }

  update_phase(info: any): Observable<any> {
    return this.http.post<string>(this.update_phaseUrl, info);
  }

  delete_phase(info: any): Observable<any> {
    return this.http.post<string>(this.delete_phaseUrl, info);
  }

  update_projet(info: any): Observable<any> {
    return this.http.post<string>(this.update_projetUrl, info);
  }

  delete_projet(info: any): Observable<any> {
    return this.http.post<string>(this.delete_projetUrl, info);
  }

  projet_groupes(info: any): Observable<any> {
    return this.http.post<string>(this.projet_groupesUrl, info);
  }
  
  add_tache(info: any): Observable<any> {
    return this.http.post<string>(this.add_tacheUrl, info);
  }

  update_tache(info: any): Observable<any> {
    return this.http.post<string>(this.update_tacheUrl, info);
  }

  delete_tache(info: any): Observable<any> {
    return this.http.post<string>(this.delete_tacheUrl, info);
  }
  
  add_sous_tache(info: any): Observable<any> {
    return this.http.post<string>(this.add_sous_tacheUrl, info);
  }

  update_sous_tache(info: any): Observable<any> {
    return this.http.post<string>(this.update_sous_tacheUrl, info);
  }

  delete_sous_tache(info: any): Observable<any> {
    return this.http.post<string>(this.delete_sous_tacheUrl, info);
  }

  add_groupe(info: any): Observable<any> {
    return this.http.post<string>(this.add_groupe_infoUrl, info, httpOptions);
  }

  update_groupe(info: any): Observable<any> {
    return this.http.post<string>(this.update_groupe_infoUrl, info, httpOptions);
  }

  delete_groupe(info: any): Observable<any> {
    return this.http.post<string>(this.delete_groupe_infoUrl, info);
  }

  delete_user(info: any): Observable<any> {
    return this.http.post<string>(this.delete_user_infoUrl, info);
  }

  update_user(info: any): Observable<any> {
    return this.http.post<string>(this.update_user_infoUrl, info, httpOptions);
  }

  add_professeur(info: any): Observable<any> {
    return this.http.post<string>(this.add_professeur_infoUrl, info, httpOptions);
  }
 
  modifier_info(info: any): Observable<any> {
     return this.http.post<string>(this.modifier_infoUrl, info);
  }

  eleves(): Observable<any> {
    return this.http.get<string>(this.elevesUrl,httpOptions);
  }

  professeurs(): Observable<any> {
    return this.http.get<string>(this.professeursUrl,httpOptions);
  }

  gestion_groupes(): Observable<any> {
    return this.http.get<string>(this.gestion_groupesUrl,httpOptions);
  }
  users(): Observable<any> {
    return this.http.get<string>(this.usersUrl,httpOptions);
  }

  profile(file: any): Observable<any> {
    return this.http.post<string>(this.profileUrl, file);
  }

  production_tache(file: any): Observable<any> {
    return this.http.post<string>(this.production_tacheUrl, file);
  }
  document_projet(file: any): Observable<any> {
    return this.http.post<string>(this.document_projetUrl, file);
  }
  production_delete(id: any): Observable<any> {
    return this.http.post<string>(this.delete_production_tacheUrl, id);
  }

  delete_document(id: any): Observable<any> {
    return this.http.post<string>(this.delete_documentUrl, id);
  }
 
  getFiles(): Observable<any> {
    return this.http.get(this.filesUrl);
  }

  projets(): Observable<any> {
    return this.http.get(this.projetsUrl);
  }

  inits(): Observable<any> {
    return this.http.get(this.initUrl);
  }

  groupes(): Observable<any> {
    return this.http.get(this.mes_groupes_tacheUrl);
  }

  groupes_prof(): Observable<any> {
    return this.http.get(this.groupesUrl);
  }

  sendmail(mail: any): Observable<any> {
    return this.http.post<string>(this.sendmailUrl, mail);
  }

  verifier_password(id: any,password: any): Observable<any> {
    return this.http.get(this.verifier_password_infoUrl+"/"+id+"/"+password);
  }

  export_zip(id: any): Observable<any> {
    return this.http.get(this.export_zipUrl+"/"+id);
  }

  
 
}
