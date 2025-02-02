import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Retail Cart';
}
