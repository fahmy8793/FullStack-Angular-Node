import { Component } from '@angular/core';
import { CardbookComponent } from '../cardbook/cardbook.component';
interface BookData {
  id: number;
  title: string;
  auther: string;
  img: string;
  price: number;
  rate: number;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardbookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  booksData: BookData[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      auther: 'F. Scott Fitzgerald',
      img: 'book1.jpg',
      price: 10.99,
      rate: 4.5,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      auther: 'Harper Lee',
      img: 'book2.jpg',
      price: 12.99,
      rate: 4.8,
    },
    {
      id: 3,
      title: '1984',
      auther: 'George Orwell',
      img: 'book3.jpg',
      price: 15.99,
      rate: 4.7,
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      auther: 'Jane Austen',
      img: 'book4.jpg',
      price: 9.99,
      rate: 4.6,
    },
    {
      id: 5,
      title: 'The Catcher in the Rye',
      auther: 'J.D. Salinger',
      img: 'book5.jpg',
      price: 11.99,
      rate: 4.4,
    },
  ];
}
