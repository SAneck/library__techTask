import { Component } from '@angular/core';
import { Book } from '../book';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Library } from '../library';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Reviews } from "../reviews/reviews";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-book-info',
  imports: [
    AsyncPipe, 
    MatCardModule, 
    MatButtonModule, 
    Reviews, 
    MatIconModule, 
    FormsModule, 
    NgIf,
    MatDialogModule, 
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogTitle
  ],
  standalone: true,
  templateUrl: './book-info.html',
  styleUrl: './book-info.scss',
})
export class BookInfo {
  bookInfo$: Observable<Book & { isEditing: boolean } | null>

  constructor(private libraryService: Library, private route: ActivatedRoute, private router: Router) {
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

  edit(book: Book) {
    if (book.isEditing) {
      this.libraryService.updateBook(book).subscribe(() => {
        this.libraryService.editingBookId.next(null);
        this.libraryService.reload$.next();
      });
    } else {
      this.libraryService.editingBookId.next(book.id!);
    }
  }

  deleteBook(id: string) {
    this.libraryService.deleteBook(id).subscribe(() => {
      this.libraryService.reload$.next()
      this.router.navigate(['/'])
    })
  }

}
