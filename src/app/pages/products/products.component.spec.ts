import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products } from './products.component';
import { ProductService } from '@/app/services/product/product.service';
import { CartService } from '@/app/services/cart/cart.service';
import { QuantityControl } from '@/app/components/quantity-control/quantity-control.component';
import { of } from 'rxjs';
import { Product } from '@/app/models/product.model';
import { By } from '@angular/platform-browser';

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 10, image: 'img1.jpg' },
  { id: 2, name: 'Product 2', price: 20, image: 'img2.jpg' },
];

const mockCart = {
  items: [{ product: { ...mockProducts[0] }, quantity: 2 }],
  total: 20,
};

describe('ProductsComponent', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const cartSpy = jasmine.createSpyObj('CartService', [
      'getCart',
      'addToCart',
      'removeFromCart',
    ]);

    await TestBed.configureTestingModule({
      imports: [QuantityControl, Products],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: CartService, useValue: cartSpy },
      ],
    }).compileComponents();

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    productService.getProducts.and.returnValue(of(mockProducts));
    cartService.getCart.and.returnValue(of(mockCart));

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display products', () => {
    const productElements = fixture.debugElement.queryAll(By.css('h3'));
    expect(productElements.length).toBe(mockProducts.length);
    expect(productElements[0].nativeElement.textContent).toContain('Product 1');
    expect(productElements[1].nativeElement.textContent).toContain('Product 2');
  });

  it('should show quantity control for items in cart', () => {
    const quantityControls = fixture.debugElement.queryAll(
      By.css('quantity-control')
    );
    expect(quantityControls.length).toBe(1); // Only one product is in cart
  });

  it('should call addToCart when add button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProducts[0], 1);
  });

  it('should call removeFromCart when quantity is updated to zero', () => {
    component.removeFromCart(1);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });
});
