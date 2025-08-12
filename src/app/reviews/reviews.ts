import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Library } from '../library';
import { Book } from '../book';

@Component({
  selector: 'app-reviews',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss'
})
export class Reviews implements OnInit {
@Input() book!: Book;
@Output() ratingChanged = new EventEmitter<number>();
  maxRating = 5;
  currentRating = 0;
  stars: number[] = [];

  constructor(private libraryService: Library) {}

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book'] && this.book) {
      this.currentRating = this.book.rating || 0;
    }
  }

  rate(rating: number) {
    this.currentRating = rating;
    this.libraryService.editRating(this.book.id!, rating).subscribe();
  }
}
