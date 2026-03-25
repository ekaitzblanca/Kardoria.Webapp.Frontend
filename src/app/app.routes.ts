import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
	},
	{
		path: 'home',
		pathMatch: 'full',
		redirectTo: '',
	},
	{
		path: 'game',
		loadComponent: () => import('./pages/game/game.page').then((m) => m.GamePage),
	},
	{
		path: 'account',
		loadComponent: () => import('./pages/account/account.page').then((m) => m.AccountPage),
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
	},
	{
		path: 'register',
		loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
