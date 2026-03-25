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
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'profile',
			},
			{
				path: 'collection',
				loadComponent: () =>
					import('./components/game-panels/game-collection-panel/game-collection-panel').then(
						(m) => m.GameCollectionPanel
					),
			},
			{
				path: 'inventory',
				loadComponent: () =>
					import('./components/game-panels/game-inventory-panel/game-inventory-panel').then(
						(m) => m.GameInventoryPanel
					),
			},
			{
				path: 'profile',
				loadComponent: () =>
					import('./components/game-panels/game-profile-panel/game-profile-panel').then(
						(m) => m.GameProfilePanel
					),
			},
			{
				path: 'boosters',
				loadComponent: () =>
					import('./components/game-panels/game-boosters-panel/game-boosters-panel').then(
						(m) => m.GameBoostersPanel
					),
			},
			{
				path: 'market',
				loadComponent: () =>
					import('./components/game-panels/game-market-panel/game-market-panel').then(
						(m) => m.GameMarketPanel
					),
			},
		],
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
