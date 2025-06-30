import { CartService } from './../services/cartService.service';
import { Component, Input } from '@angular/core';
// import { CartService } from '../services/cartService.service';
interface BookData {
  id: number;
  title: string;
  auther: string;
  img: string;
  price: number;
  rate: number;
}
@Component({
  selector: 'app-cardbook',
  standalone: true,
  imports: [],
  templateUrl: './cardbook.component.html',
  styleUrl: './cardbook.component.scss',
})
export class CardbookComponent {
  @Input() bookData!: any;
  // fullPath: any;
  // bookData.img = '' + this.bookData.img;
  constructor(private CartService: CartService) {}
  onInit() {
    // this.fullPath =  + this.bookData.img; // Base path for book images
    // this.bookData.img = this.fullPath;
  }

  getBookImagePath() {
    return '../../assets/books_Imgs/' + this.bookData.img;
  }
  addToCart() {
    const itemToAdd = {
      id: this.bookData.id,
      title: this.bookData.title,
      author: this.bookData.auther,
      image: this.bookData.image,
      price: this.bookData.price,
      quantity: 1,
    };

    this.CartService.addItem(itemToAdd);
    alert(`"${this.bookData.title}" has been added to your cart!`);
    console.log('Book added to cart:', itemToAdd);
  }
}
