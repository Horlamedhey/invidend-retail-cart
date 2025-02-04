import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppHeader } from './header.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartService } from '@/app/services/cart/cart.service';
import { BehaviorSubject, Subject } from 'rxjs';

describe('AppHeader (Standalone Angular 18)', () => {
  let component: AppHeader;
  let fixture: ComponentFixture<AppHeader>;

  // Subjects to simulate router events and cart count changes.
  let routerEventsSubject: Subject<any>;
  let cartCountSubject: BehaviorSubject<number>;

  // Updated router stub with getters and stub methods for createUrlTree and serializeUrl.
  const routerStub: Partial<Router> = {
    get events() {
      return routerEventsSubject.asObservable();
    },
    createUrlTree: jasmine
      .createSpy('createUrlTree')
      .and.callFake((commands: any[], extras?: any) => {
        // Return a dummy UrlTree object.
        return { commands, extras } as any;
      }),
    serializeUrl: jasmine
      .createSpy('serializeUrl')
      .and.callFake((urlTree: any) => {
        // Return a dummy string representation for the UrlTree.
        return 'dummy-url';
      }),
  };

  // Stub for ActivatedRoute: default snapshot with an empty URL.
  const activatedRouteStub: Partial<ActivatedRoute> = {
    snapshot: {
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: null as any,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: null as any,
      queryParamMap: null as any,
      title: '', // Add the missing title property
    },
    firstChild: null,
  };

  // Stub for CartService: provides a getCartItemsCount observable.
  const cartServiceStub: Partial<CartService> = {
    getCartItemsCount: () => cartCountSubject.asObservable(),
  };

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    cartCountSubject = new BehaviorSubject<number>(0);

    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: CartService, useValue: cartServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isCart to false when the route is home (empty URL)', fakeAsync(() => {
    routerEventsSubject.next(new NavigationEnd(1, '', ''));
    tick();
    fixture.detectChanges();
    expect(component.isCart).toBeFalse();
  }));

  it('should set isCart to true when the route is cart (non-empty URL)', fakeAsync(() => {
    (activatedRouteStub as any).firstChild = {
      snapshot: { routeConfig: { path: 'cart' } },
      firstChild: null,
    };
    routerEventsSubject.next(new NavigationEnd(2, '/cart', '/cart'));
    tick();
    fixture.detectChanges();
    expect(component.isCart).toBeTrue();
  }));

  it('should update cartItemsCount from CartService', fakeAsync(() => {
    cartCountSubject.next(5);
    tick();
    fixture.detectChanges();
    expect(component.cartItemsCount).toBe(5);
    const span: HTMLElement | null =
      fixture.nativeElement.querySelector('span');
    expect(span?.textContent).toContain('5');
  }));
});
