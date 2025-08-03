import { Component, OnInit } from '@angular/core';
import { debounceTime, Observable } from 'rxjs';
import { Book } from '../book';
import { Library } from '../library';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
@Component({
  selector: 'app-books-list',
  imports: [
    AsyncPipe,
    RouterModule,
    MatCardTitle,
    MatCard,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './books-list.html',
  styleUrl: './books-list.scss',
})
export class BooksList implements OnInit {
  search = new FormControl(null);

  books$: Observable<Book[]>;

  constructor(private libraryService: Library) {
    this.books$ = this.libraryService.books$;
  }

  ngOnInit() {
    this.libraryService.reload$.next();

    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((v) => this.libraryService.search$.next(v));
  }
}
