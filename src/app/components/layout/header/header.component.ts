import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  UrlSegment,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { CartService } from '@/app/services/cart/cart.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class AppHeader implements OnInit {
  notHome = false;
  cartItemsCount = 0;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cartService: CartService
  ) {}
  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd), // Listen for route changes
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild; // Get the deepest active route
          }
          return route.snapshot.url;
        })
      )
      .subscribe((url: UrlSegment[]) => {
        this.notHome = Boolean(url.length);
      });
    this.cartService.getCartItemsCount().subscribe((count) => {
      this.cartItemsCount = count;
    });
  }
}
