// import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { MatButtonModule } from '@angular/material/button';
// // import { MatInputModule } from '@angular/material/input';
// // import { MatFormFieldModule } from '@angular/material/form-field';
// // import { MatSelectModule } from '@angular/material/select';
// // import { MatCardModule } from '@angular/material/card';
// // import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { BookService } from '../../../services/book.service';
// // import { Book } from '../../../models/book.model';

// @Component({
//   selector: 'app-book-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     // MatButtonModule,
//     // MatInputModule,
//     // MatFormFieldModule,
//     // MatSelectModule,
//     // MatCardModule,
//     // MatProgressBarModule
//   ],
//   templateUrl: './book-form.component.html',
//   styleUrls: ['./book-form.component.scss']
// })
// export class BookFormComponent {
//   private fb = inject(FormBuilder);
//   private bookService = inject(BookService);

//   // @Input() book?: Book;
//   @Output() formSubmit = new EventEmitter<FormData>();
//   @Output() cancel = new EventEmitter<void>();

//   bookForm: FormGroup;
//   isSubmitting = false;
//   categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy'];
//   imagePreview: string | ArrayBuffer | null = null;
//   pdfFileName = '';

//   constructor() {
//     this.bookForm = this.fb.group({
//       title: ['', Validators.required],
//       author: ['', Validators.required],
//       description: ['', [Validators.required, Validators.minLength(10)]],
//       category: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(0)]],
//       stock: [0, [Validators.required, Validators.min(0)]],
//       image: [null, Validators.required],
//       pdf: [null]
//     });
//   }

//   ngOnInit(): void {
//     if (this.book) {
//       this.bookForm.patchValue({
//         title: this.book.title,
//         author: this.book.author,
//         description: this.book.description,
//         category: this.book.category,
//         price: this.book.price,
//         stock: this.book.stock
//       });
//       this.imagePreview = this.book.imageUrl;
//       this.bookForm.get('image')?.clearValidators();
//     }
//   }

//   onImagePicked(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       this.bookForm.patchValue({ image: file });
//       this.bookForm.get('image')?.updateValueAndValidity();
      
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   onPdfPicked(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       this.bookForm.patchValue({ pdf: file });
//       this.pdfFileName = file.name;
//     }
//   }

//   onSubmit(): void {
//     if (this.bookForm.invalid) {
//       return;
//     }

//     this.isSubmitting = true;
//     const formData = new FormData();

//     Object.keys(this.bookForm.value).forEach(key => {
//       if (this.bookForm.value[key] !== null) {
//         formData.append(key, this.bookForm.value[key]);
//       }
//     });

//     this.formSubmit.emit(formData);
//   }

//   onCancel(): void {
//     this.cancel.emit();
//   }
// }