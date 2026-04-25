import { Routes } from '@angular/router';
import { Games } from './games/games';
import { AddGame } from './add-game/add-game';
import { UpdateGame } from './update-game/update-game';
import { RechercheParType } from './recherche-par-type/recherche-par-type';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { gameGuard } from './game-guard';
import { ListeType } from './liste-type/liste-type';
import { Logout } from './logout/logout';
import { Register } from './register/register';
import { VerifEmail } from './verif-email/verif-email';

export const routes: Routes = [ 
  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'register', component: Register },
  { path: 'games', component: Games, runGuardsAndResolvers: 'always' },
  { path: 'add-game', component: AddGame, canActivate: [gameGuard], runGuardsAndResolvers: 'always' },
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: 'updateGame/:id', component: UpdateGame, runGuardsAndResolvers: 'always' },
  { path: 'rechercheParType', component: RechercheParType, runGuardsAndResolvers: 'always' },
  { path: 'rechercheParNom', component: RechercheParNom, runGuardsAndResolvers: 'always' },
  { path: 'app-forbidden', component: Forbidden },
  { path: 'listeTypes', component: ListeType, canActivate: [gameGuard], runGuardsAndResolvers: 'always' },
  { path: 'verifEmail/:email', component: VerifEmail },
];

