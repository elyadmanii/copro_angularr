import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { PmComponent } from './pm/pm.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { ProjetsComponent } from './projets/projets.component';
import { ForumsComponent } from './forums/forums.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { GroupeComponent } from './groupe/groupe.component';
import { GroupeProfesseurComponent } from './groupe-professeur/groupe-professeur.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { AuthGuard } from './auth-guard.service';

 

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'projets',
        component: ProjetsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'projets/new',
        component: NewProjectComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
        
    },
    {
        path: 'forums',
        component: ForumsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'discussion',
        component: DiscussionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'groupes',
        component: GroupeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'gestion_groupes',
        component: GroupeProfesseurComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pm',
        component: PmComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: RegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
