import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BooksList } from "./books-list/books-list";
import { AddBook } from "./add-book/add-book";
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BooksList, MatButtonModule, RouterModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private route: ActivatedRoute) {
  }

  onMainPage$!: Observable<boolean>

  ngOnInit () {
    this.onMainPage$ = this.route.params.pipe(map(p => !p['id']))
  }
}
