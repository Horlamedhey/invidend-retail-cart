import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './components/layout/header/header.component';
import { CartService } from './services/cart/cart.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeader],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Retail Cart';
}
