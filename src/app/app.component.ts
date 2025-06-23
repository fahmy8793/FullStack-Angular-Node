import { Component } from '@angular/core';
import { HeaderComponent } from "./core/layout/header/header.component";
import { FooterComponent } from "./core/layout/footer/footer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FullStack-Angular-Node';
}
