import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantityControl } from './quantity-control.component';
import { By } from '@angular/platform-browser';

describe('QuantityControl Component', () => {
  let component: QuantityControl;
  let fixture: ComponentFixture<QuantityControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityControl],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should increment quantity when + button is clicked', () => {
    component.quantity = 5;
    fixture.detectChanges();

    const incrementButton = fixture.debugElement.query(
      By.css('button:last-child')
    );
    incrementButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.quantity).toBe(6);
  });

  it('should decrement quantity when - button is clicked', () => {
    component.quantity = 5;
    fixture.detectChanges();

    const decrementButton = fixture.debugElement.query(
      By.css('button:first-child')
    );
    decrementButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.quantity).toBe(4);
  });

  it('should not decrement below minQuantity', () => {
    component.quantity = 0;
    component.minQuantity = 0;
    fixture.detectChanges();

    const decrementButton = fixture.debugElement.query(
      By.css('button:first-child')
    );
    decrementButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.quantity).toBe(0);
  });

  it('should not increment above maxQuantity', () => {
    component.quantity = 99;
    component.maxQuantity = 99;
    fixture.detectChanges();

    const incrementButton = fixture.debugElement.query(
      By.css('button:last-child')
    );
    incrementButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.quantity).toBe(99);
  });

  it('should update quantity when input value changes', () => {
    component.quantity = 5;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '10';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.quantity).toBe(10);
  });

  it('should emit quantityChange when quantity is updated', () => {
    spyOn(component.quantityChange, 'emit');
    component.updateQuantity(7);

    expect(component.quantityChange.emit).toHaveBeenCalledWith(7);
  });
});
