import { Routes } from '@angular/router';
import { BookInfo } from './book-info/book-info';
import { AddBook } from './add-book/add-book';

export const routes: Routes = [
  {
    path: ':id',
    component: BookInfo,
  },
  { path: '**', component: AddBook },
];
