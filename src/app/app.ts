import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { BooksList } from './books-list/books-list';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BooksList, MatButtonModule, RouterModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private route: ActivatedRoute) {}

  onMainPage$!: Observable<boolean>;

  ngOnInit() {
    this.onMainPage$ = this.route.params.pipe(map((p) => !p['id']));
  }
}
