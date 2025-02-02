import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cart } from './cart.component';
import { CartService, type CartProps } from '@/app/services/cart/cart.service';
import { of } from 'rxjs';
import { Product } from '@/app/models/product.model';
import { QuantityControl } from '@/app/components/quantity-control/quantity-control.component';

describe('Cart Component', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Create a spy for CartService
    cartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'addToCart',
      'removeFromCart',
      'applyDiscount',
    ]);

    // Set initial cart data
    const mockCart: CartProps = {
      items: [
        {
          product: {
            id: 1,
            name: 'Test Product',
            price: 10,
            image: 'test.jpg',
          },
          quantity: 1,
        },
      ],
      total: 10,
    };

    cartService.getCart.and.returnValue(of(mockCart));

    await TestBed.configureTestingModule({
      providers: [
        Cart,
        QuantityControl,
        { provide: CartService, useValue: cartService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the cart title', () => {
    const cartTitle = fixture.nativeElement.querySelector('h2');
    expect(cartTitle.textContent).toContain('Cart');
  });

  it('should display cart items when cart has items', () => {
    const cartItems = fixture.nativeElement.querySelectorAll('.grid-cols-1');
    expect(cartItems.length).toBeGreaterThan(0);
  });

  it('should call addToCart on CartService when adding an item to the cart', () => {
    const product: Product = {
      id: 2,
      name: 'New Product',
      price: 20,
      image: 'new-product.jpg',
    };
    component.addToCart(product, 1);
    expect(cartService.addToCart).toHaveBeenCalledWith(product, 1);
  });

  it('should call removeFromCart on CartService when removing an item from the cart', () => {
    const productId = 1;
    component.removeFromCart(productId);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(productId);
  });

  it('should show an error message when applying an invalid discount code', () => {
    console.log(2);
    component.discountCode = 'INVALID_CODE';
    cartService.applyDiscount.and.returnValue(false);
    component.applyDiscount();
    expect(component.errorMessage).toBe('Invalid discount code');
  });

  it('should apply a discount when a valid discount code is provided', () => {
    component.discountCode = 'SAVE10';
    cartService.applyDiscount.and.returnValue(true);
    component.applyDiscount();
    expect(component.errorMessage).toBe('');
  });

  it('should update the total when applying a discount code', () => {
    const mockCartWithDiscount: CartProps = {
      items: [
        {
          product: {
            id: 1,
            name: 'Test Product',
            price: 10,
            image: 'test.jpg',
          },
          quantity: 1,
        },
      ],
      total: 9, // After applying 10% off
    };
    cartService.getCart.and.returnValue(of(mockCartWithDiscount));
    component.ngOnInit();
    fixture.detectChanges();

    const total = fixture.nativeElement.querySelector('.text-xl');
    expect(total.textContent).toContain('$9');
  });

  it('should display "No items in cart" when the cart is empty', () => {
    const emptyCart: CartProps = { items: [], total: 0 };
    cartService.getCart.and.returnValue(of(emptyCart));
    component.ngOnInit();
    fixture.detectChanges();

    const noItemsMessage = fixture.nativeElement.querySelector('p.text-2xl');
    expect(noItemsMessage.textContent).toContain('No items in cart');
  });
});
