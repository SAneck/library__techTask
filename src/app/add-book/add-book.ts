import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Library } from '../library';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
  ],
  standalone: true,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',
})
export class AddBook implements OnDestroy {
  form: FormGroup;
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private libraryService: Library,
    private router: Router
  ) {
    this.form = this.fb.group({
      author: [null, Validators.required],
      description: [null, Validators.required],
      title: [null, Validators.required],
    });
  }

  onSubmit() {
    this.libraryService
      .addBook(this.form.value)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(({ id }) => {
        this.libraryService.reload$.next();
        this.router.navigate([id]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
