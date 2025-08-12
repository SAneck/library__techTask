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
} from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class Library {
  private apiUrl = 'http://localhost:3000/books';

  reload$ = new Subject<void>();

  search$ = new BehaviorSubject<string | null>(null);

  books$ = combineLatest([
    this.reload$.pipe(startWith(null)),
    this.search$.pipe(startWith('1')),
  ]).pipe(
    switchMap(() => this.getBooks()),
    map((books) => {
      return books.filter((b) =>
        b.title.toLowerCase().includes(this.search$.value?.toLowerCase() || '')
      );
    }),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

editRating(bookId: string, rating: number): Observable<Book> {
  return this.http.patch<Book>(`${this.apiUrl}/${bookId}`, { rating });
}
}
