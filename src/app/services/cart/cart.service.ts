import { Inject, Injectable } from '@angular/core';
import { Product } from '@/app/models/product.model';
import { CartItem } from '@/app/models/cartItem.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export interface CartProps {
  items: CartItem[];
  discountCode?: string;
  total: number;
}

export const INIT_CART_VAL: CartProps = {
  items: [],
  total: 0,
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItems: CartItem[] = [];
  private discountCode?: string;
  private readonly cart = new BehaviorSubject<CartProps>(INIT_CART_VAL);
  private readonly cartItemsCount = new BehaviorSubject<number>(0);
  private readonly discountCodes: Record<string, number> = {
    SAVE10: 0.1, // 10% off
    SAVE5: 5, // $5 off
  };

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) this.initCart();
  }
  /** Initialize the cart. */

  private initCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      this.cartItems.push(...cart.items);
      this.discountCode = cart.discountCode;
      this.cartItemsCount.next(cart.items.length);
      this.updateStore();
    }
  }

  /** Get cart items. */
  getCart(): Observable<CartProps> {
    return this.cart.asObservable();
  }

  /** Get number of cart items. */
  getCartItemsCount(): Observable<number> {
    return this.cartItemsCount.asObservable();
  }

  /** Add a product to the cart.  */
  addToCart(product: Product, quantity: number) {
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      this.cartItems.push({ product, quantity });
      this.cartItemsCount.next(this.cartItemsCount.value + 1);
    }
    this.updateStore();
  }

  /** Remove a product from the cart  */
  removeFromCart(productId: number) {
    const index = this.cartItems.findIndex(
      (item) => item.product.id === productId
    );
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartItemsCount.next(this.cartItemsCount.value - 1);
      this.updateStore();
    }
  }

  /** Apply discount code */
  applyDiscount(code: string): boolean {
    // console.log(44444, code);
    if (this.validateDiscountCode(code)) {
      this.discountCode = code;
      this.updateStore();
      return true;
    }
    return false;
  }

  /** Validate discount code */
  private validateDiscountCode(code: string): boolean {
    return !!this.discountCodes[code];
  }

  /** Calculate Individual Item subtotal */
  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  /** Calculate cart subtotal  */
  private getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + this.getItemSubtotal(item),
      0
    );
  }

  /** Calculate grand total  */
  private getTotal(): number {
    let subtotal = this.getSubtotal();
    switch (this.discountCode) {
      case 'SAVE10':
        subtotal *= 0.9;
        break;
      case 'SAVE5':
        subtotal = Math.max(0, subtotal - 5);
        break;
      default:
        break;
    }
    return Number(subtotal.toFixed(2));
  }

  /** Update the cart store */
  private updateStore() {
    const cartData = {
      items: [...this.cartItems],
      discountCode: this.discountCode,
      total: this.getTotal(),
    };
    this.cart.next(cartData);
    localStorage.setItem('cart', JSON.stringify(cartData));
  }
}
