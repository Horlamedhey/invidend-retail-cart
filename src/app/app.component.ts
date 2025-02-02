import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '@/app/components/layout/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeader],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Retail Cart';
}
