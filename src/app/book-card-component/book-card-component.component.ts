import { Component, Input } from '@angular/core';
interface BookData {
  id: number,
  title: string,
  auther: string,
  img: string,
  price: number,
  rate: number
}
@Component({
  selector: 'app-book-card-component',
  standalone: true,
  imports: [],
  templateUrl: './book-card-component.component.html',
  styleUrl: './book-card-component.component.scss'
})
export class BookCardComponentComponent {
  // bookData!: BookData;
  @Input() bookData!: any;
  // fullPath: any;
  // bookData.img = '' + this.bookData.img;
  onInit() {
    // this.fullPath =  + this.bookData.img; // Base path for book images
    // this.bookData.img = this.fullPath;
  }

  getBookImagePath() {
    
    return '../../assets/books_Imgs/' + this.bookData.img;
  }
}
