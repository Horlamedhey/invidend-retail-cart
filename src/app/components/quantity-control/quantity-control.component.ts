import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'quantity-control',
  standalone: true,
  templateUrl: './quantity-control.component.html',
  styleUrls: ['./quantity-control.component.css'],
})
export class QuantityControl {
  @Input() quantity = 0;
  @Input() minQuantity = 0;
  @Input() maxQuantity = 99;
  @Output() quantityChange = new EventEmitter<number>();

  updateQuantity(newQuantity: number) {
    this.quantity = Math.min(
      Math.max(newQuantity, this.minQuantity),
      this.maxQuantity
    );
    this.quantityChange.emit(this.quantity);
  }

  incrementQuantity() {
    this.updateQuantity(this.quantity + 1);
  }

  decrementQuantity() {
    this.updateQuantity(this.quantity - 1);
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = Number.parseInt(inputElement.value, 10);
    if (!isNaN(newQuantity)) {
      this.updateQuantity(newQuantity);
    }
  }

  addToCart() {
    alert(`Added ${this.quantity} item(s) to cart`);
  }
}
