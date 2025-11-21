import { Routes } from '@angular/router';
import { Chats } from './chat/chat';
import { Config } from './config/config';
import { Contatos } from './contatos/contatos';
import { PlanoCanal } from './plano-canal/plano-canal';

export const routes: Routes = [
  { path: '', component: Chats },
  { path: 'config', component:  Config },
    { path: 'contatos', component:  Contatos},
    {path: 'planoMensal', component: PlanoCanal}
];

