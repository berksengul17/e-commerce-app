package com.berk.server.cart;

import com.berk.server.cartItem.CartItem;
import com.berk.server.cartItem.CartItemService;
import com.berk.server.product.Product;
import com.berk.server.product.ProductService;
import com.berk.server.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemService cartItemService;
    @Mock
    private ProductService productService;

    @InjectMocks
    private CartService cartService;

    private List<Cart> mockCarts;

    @BeforeEach
    void setUp() {
        mockCarts = Arrays.asList(new Cart(1L, new User(1L, "John", "Doe", "john@gmail.com")),
                                    new Cart(2L, new User(2L, "Jack", "Doe", "jack@gmail.com")));
    }

    @Test
    public void testGetCartByUserId_ExistingId() {
        Cart mockCart = mockCarts.get(0);
        Long mockCartId = mockCart.getId();

        when(cartRepository.findByUserId(mockCartId))
                .thenReturn(Optional.of(mockCart));

        Cart cart = cartService.getCartByUserId(mockCartId);

        assertEquals(mockCartId, cart.getId());
        assertEquals(mockCart.getUser(), cart.getUser());

        verify(cartRepository, times(1)).findByUserId(mockCartId);
    }

    @Test
    public void testGetCartByUserId_NonExistingId() {
        Long nonExistingId = 100L;

        when(cartRepository.findByUserId(nonExistingId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> cartService.getCartByUserId(nonExistingId));

        verify(cartRepository, times(1)).findByUserId(nonExistingId);
    }

    @Test
    public void testCreateCart_UserWithNoCart() {
        User userWithNoCart = new User(3L, "Emma", "Stone", "emma@gmail.com");
        Cart newCart = new Cart(userWithNoCart);

        when(cartRepository.save(newCart))
                .thenReturn(newCart);

        Cart cart = cartService.createCart(userWithNoCart);

        assertEquals(newCart.getUser(), cart.getUser());

        verify(cartRepository, times(1)).save(newCart);
    }

    @Test
    public void testCreateCart_UserWithCart() {
        User userWithCart = new User(3L, "Emma", "Stone", "emma@gmail.com");
        Cart newCart = new Cart();
        userWithCart.setCart(newCart);

        Cart cart = cartService.createCart(userWithCart);

        assertNull(cart);
    }

    @Test
    public void testAddItemToCart_NewItem() {
        Cart cart = mockCarts.get(0);
        List<CartItem> cartItems = new ArrayList<>();
        cart.setCartItems(cartItems);

        Long userId = cart.getUser().getId();
        Long productId = 1L;

        Product product = new Product(productId, "Product 1", 10.0);
        CartItem newCartItem = new CartItem(1, cart, product);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(productService.getProductById(productId)).thenReturn(product);
        when(cartItemService.createCartItem(newCartItem)).thenReturn(newCartItem);

        CartItem addedItemToCart = cartService.addItemToCart(userId, productId);

        assertEquals(newCartItem, addedItemToCart);
        assertEquals(newCartItem.getQuantity(), addedItemToCart.getQuantity());
        assertEquals(1, cartItems.size());
        verify(cartItemService, times(1)).createCartItem(newCartItem);
    }

    @Test
    public void testAddItemToCart_ExistingItem() {
        Cart cart = mockCarts.get(0);

        Long userId = cart.getUser().getId();
        Long productId = 1L;

        Product product = new Product(productId, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 1, cart, product);

        CartItem updatedCartItem = new CartItem(cartItem.getId(),
                cartItem.getQuantity() + 1, cart, product);

        List<CartItem> cartItems = List.of(cartItem);
        cart.setCartItems(cartItems);


        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(productService.getProductById(productId)).thenReturn(product);
        when(cartItemService.updateCartItem(cartItem.getId(), cartItem.getQuantity() + 1))
                .thenReturn(updatedCartItem);

        CartItem addedItemToCart = cartService.addItemToCart(userId, productId);

        assertEquals(updatedCartItem, addedItemToCart);
        assertEquals(1, cartItems.size());

        verify(cartItemService, times(1)).updateCartItem(cartItem.getId(), cartItem.getQuantity() + 1);
    }

    @Test
    public void test_removeItemFromCart() {
        Cart cart = mockCarts.get(0);

        Long userId = cart.getUser().getId();
        Long productId = 1L;

        Product product = new Product(productId, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);

        CartItem updatedCartItem = new CartItem(cartItem.getId(),
                cartItem.getQuantity() - 1, cart, product);

        List<CartItem> cartItems = List.of(cartItem);
        cart.setCartItems(cartItems);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartItemService.getCartItemById(cartItem.getId())).thenReturn(cartItem);
        when(cartItemService.updateCartItem(cartItem.getId(), updatedCartItem.getQuantity()))
                .thenReturn(updatedCartItem);

        Cart result = cartService.removeItemFromCart(userId, cartItem.getId());
        CartItem resultCartItem = result.getCartItems().get(0);

        assertEquals(1, resultCartItem.getQuantity());
        assertEquals(1, cartItems.size());

        verify(cartItemService, times(1)).updateCartItem(cartItem.getId(), updatedCartItem.getQuantity());
    }

    @Test
    public void test_deleteItemFromCart() {
        Cart cart = mockCarts.get(0);

        Long userId = cart.getUser().getId();

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);
        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem);
        cart.setCartItems(cartItems);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartItemService.getCartItemById(cartItem.getId()))
                .thenReturn(cartItem);
        doNothing().when(cartItemService).deleteCartItem(cartItem);

        cartService.deleteItemFromCart(userId, cartItem.getId());

        assertEquals(0, cartItems.size());

        verify(cartItemService, times(1)).deleteCartItem(cartItem);
    }

    @Test
    public void test_clearCart() {
        Cart cart = mockCarts.get(0);

        Long userId = cart.getUser().getId();

        Product product1 = new Product(1L, "Product 1", 10.0);
        CartItem cartItem1 = new CartItem(1L, 2, cart, product1);

        Product product2 = new Product(2L, "Product 2", 20.0);
        CartItem cartItem2 = new CartItem(2L, 2, cart, product2);

        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem1);
        cartItems.add(cartItem2);

        cart.setCartItems(cartItems);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        doNothing().when(cartItemService).deleteAllByCartId(cart.getId());

        cartService.clearCart(userId);

        assertEquals(0, cartItems.size());

        verify(cartItemService, times(1)).deleteAllByCartId(cart.getId());

    }

    @Test
    public void test_calculateTotalCartPrice() {
        Cart cart = mockCarts.get(0);

        Long userId = cart.getUser().getId();

        Product product1 = new Product(1L, "Product 1", 10.0);
        CartItem cartItem1 = new CartItem(1L, 2, cart, product1);

        Product product2 = new Product(2L, "Product 2", 20.0);
        CartItem cartItem2 = new CartItem(2L, 2, cart, product2);

        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem1);
        cartItems.add(cartItem2);

        cart.setCartItems(cartItems);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        double totalPrice = cartService.calculateTotalCartPrice(userId);

        assertEquals(60, totalPrice);
    }

}