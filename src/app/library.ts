import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class Library {
  private apiUrl = 'http://localhost:3000/books';

  reload$ = new Subject<void>();
  search$ = new BehaviorSubject<string | null>(null);
  editingBookId = new BehaviorSubject<string | null>(null)


  books$ = combineLatest([
    this.reload$.pipe(startWith(null)),
    this.search$.pipe(startWith('')),
    this.editingBookId.pipe(startWith(null)),
  ]).pipe(
    switchMap(([_, search, editingId]) =>
      this.getBooks().pipe(
        map((books: Book[]) =>
          books
            .filter((b) =>
              b.title.toLowerCase().includes(search?.toLowerCase() || '')
            )
            .map((b) => ({
              ...b,
              isEditing: b.id === editingId,
            }))
        )
      )
    ),
    shareReplay(1)
  );

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  editRating(bookId: string, rating: number): Observable<Book> {
    return this.http.patch<Book>(`${this.apiUrl}/${bookId}`, { rating });
  }

  editBook(id: string) {
    const currentId = this.editingBookId.value;
    if (currentId === id) {
      this.editingBookId.next(null);
    } else {
      this.editingBookId.next(id);
    }
  }
  updateBook(book: Book): Observable<Book> {
    return this.http.patch<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  deleteBook(id: string){
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
