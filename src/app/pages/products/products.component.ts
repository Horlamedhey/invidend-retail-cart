import { Component, OnInit } from '@angular/core';
import { Product } from '@/app/models/product.model';
import { ProductService } from '@/app/services/product/product.service';
import { CartService } from '@/app/services/cart/cart.service';
import { QuantityControl } from '@/app/components/quantity-control/quantity-control.component';
import { combineLatest, map } from 'rxjs';

interface ProductWithQuantity {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'products',
  standalone: true,
  imports: [QuantityControl],
  templateUrl: './products.component.html',
})
export class Products implements OnInit {
  productItems: ProductWithQuantity[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    combineLatest({
      products: this.productService.getProducts(),
      cart: this.cartService.getCart(),
    })
      .pipe(
        map(({ products, cart }) =>
          products.map((product) => {
            const cartItem = cart.items.find(
              (item) => item.product.id === product.id
            );
            return {
              product,
              quantity: cartItem?.quantity ?? 0,
            };
          })
        )
      )
      .subscribe((products) => (this.productItems = products));
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addToCart(product, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
