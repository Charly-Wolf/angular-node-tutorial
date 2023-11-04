import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart-component.html',
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [] };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onIncreaseQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onDecreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQty(item);
  }

  onCheckout(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          'pk_test_51O8gNpCarPASslRyOB50l4OXIP0qlLsbn6IeUaE4jS6g7uWWwU7FTeNmpfQqfGD1A3q4relvwav7pcD8HvB4Lyov0058BZAiqc'
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
