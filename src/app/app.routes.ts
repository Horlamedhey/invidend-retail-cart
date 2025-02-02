import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Products',
    loadComponent: () =>
      import('./pages/products/products.component').then((c) => c.Products),
  },
  {
    path: 'cart',
    title: 'Cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((c) => c.Cart),
  },
];
