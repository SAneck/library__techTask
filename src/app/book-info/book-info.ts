import { Component } from '@angular/core';
import { Book } from '../book';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Library } from '../library';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Reviews } from "../reviews/reviews";

@Component({
  selector: 'app-book-info',
  imports: [AsyncPipe, MatCardModule, MatButtonModule, Reviews],
  templateUrl: './book-info.html',
  styleUrl: './book-info.scss',
})
export class BookInfo {
  bookInfo$: Observable<Book>;

  constructor(private libraryService: Library, private route: ActivatedRoute) {
    this.bookInfo$ = this.route.params.pipe(
      map(({ id }) => id),
      switchMap((id) => {
        return this.libraryService.books$.pipe(
          map((books) => {
            return books.find((book) => book.id === id)!;
          })
        );
      })
    );
  }
  
}
