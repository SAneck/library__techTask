import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { Library } from '../library';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

export function imageValidator(component: AddBook): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return component.previewImage || control.value ? null : { required: true };
  };
}

@Component({
  selector: 'app-add-book',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIcon, 
    NgIf
  ],
  standalone: true,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',
})
export class AddBook implements OnDestroy {
  form: FormGroup;
  destroy$ = new Subject<void>();
  previewImage: string | ArrayBuffer | null = null;

  @ViewChild('imageUrlField') imageUrlField: HTMLInputElement | null = null

  constructor(
    private fb: FormBuilder,
    private libraryService: Library,
    private router: Router
  ) {
    this.form = this.fb.group({
      author: ['', Validators.required],
      description: ['', Validators.required],
      title: ['', Validators.required],
      image: ['', [imageValidator(this)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = {
      ...this.form.value,
      image: this.previewImage || this.form.value.image
    };

    this.libraryService.addBook(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id }) => {
        this.libraryService.reload$.next();
        this.router.navigate([id]);
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.previewImage = e.target.result;
        this.form.get('image')?.updateValueAndValidity();
      }
    };

    reader.readAsDataURL(file);
  }

  clearPreview() {
    this.previewImage = null;
    this.form.get('image')?.setValue('');
    this.form.get('image')?.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
