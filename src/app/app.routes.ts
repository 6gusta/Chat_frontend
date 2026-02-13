import { Routes } from '@angular/router';
import { Chats } from './chat/chat';
import { Config } from './config/config';
import { Contatos } from './contatos/contatos';
import { PlanoCanal } from './plano-canal/plano-canal';
import { CanalComponent } from './canal/canal';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';
import { Component } from '@angular/core';
import { HomeAdmin } from './home-admin/home-admin';
import { LoginUserComponent } from './login-user/login-user';
import { Perfil } from './perfil/perfil';


export const routes: Routes = [
  { path: '', component: Login },
  { path: 'config', component:  Config },
    { path: 'contatos', component:  Contatos},
    {path: 'planoMensal', component: PlanoCanal},
    {path: 'canal', component: CanalComponent},
    {path: 'cadastro', component: Cadastro},
    {path: 'login', component: Login},
    {path: 'cadastro', component: Cadastro},
    {path: 'chat', component: Chats},
    {path:"homeAdmin", component: HomeAdmin},
    {path: "loginuser", component: LoginUserComponent},
    {path: "me", component: Perfil}
];

