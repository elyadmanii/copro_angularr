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

 

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    { 
        path: 'user',
        component: UserComponent
    },
    {
        path: 'projets',
        component: ProjetsComponent
    },
    {
        path: 'projets/new',
        component: NewProjectComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'forums',
        component: ForumsComponent
    },
    {
        path: 'discussion',
        component: DiscussionComponent
    },
    {
        path: 'groupes',
        component: GroupeComponent
    },
    {
        path: 'gestion_groupes',
        component: GroupeProfesseurComponent
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
        component: RegisterComponent
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
