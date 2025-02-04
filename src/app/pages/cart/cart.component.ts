import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import {
  CartProps,
  CartService,
  INIT_CART_VAL,
} from '@/app/services/cart/cart.service';
import { QuantityControl } from '@/app/components/quantity-control/quantity-control.component';
import { Product } from '@/app/models/product.model';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [QuantityControl, FormsModule],
  templateUrl: './cart.component.html',
})
export class Cart implements OnInit {
  discountCode = '';
  discountApplied = false;
  errorMessage = '';
  cart: CartProps = INIT_CART_VAL;

  constructor(private readonly cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCart().subscribe((cart) => {
      this.cart = cart;
      this.checkDiscountCode();
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addToCart(product, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  applyDiscount(): void {
    const discountApplied = this.cartService.applyDiscount(this.discountCode);
    if (!discountApplied) {
      this.errorMessage = 'Invalid discount code';
    } else {
      this.errorMessage = '';
    }
  }

  removeDiscount(): void {
    this.cartService.removeDiscount();
  }

  checkDiscountCode(): void {
    if (this.cart.discountCode) {
      this.discountCode = this.cart.discountCode;
      this.discountApplied = true;
    } else {
      this.discountCode = '';
      this.discountApplied = false;
    }
  }
}
