import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
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
  isCart = false;
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
          return route.snapshot;
        })
      )
      .subscribe((snapshot?: ActivatedRouteSnapshot) => {
        this.isCart = snapshot?.routeConfig?.path == 'cart';
      });
    this.cartService.getCartItemsCount().subscribe((count) => {
      this.cartItemsCount = count;
    });
  }
}
