package com.berk.server.cartItem;

import com.berk.server.cart.Cart;
import com.berk.server.product.Product;
import com.berk.server.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartItemServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private CartItemService cartItemService;


    @Test
    public void testGetCartItemById_ExistingId() {

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 1, null, product);

        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));

        CartItem result = cartItemService.getCartItemById(cartItem.getId());

        assertEquals(cartItem, result);

        verify(cartItemRepository, times(1)).findById(cartItem.getId());
    }

    @Test
    public void testGetCartItemById_NonExistingId() {

        Long nonExistingId = 100L;
        when(cartItemRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> cartItemService.getCartItemById(nonExistingId));

        verify(cartItemRepository, times(1)).findById(nonExistingId);
    }

    @Test
    public void testCreateCartItem_NewProduct() {

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 1, null, product);

        when(cartItemRepository.findCartItemByProduct(product))
                .thenReturn(Optional.empty());
        when(cartItemRepository.save(cartItem)).thenReturn(cartItem);

        CartItem result = cartItemService.createCartItem(cartItem);

        assertEquals(cartItem, result);

        verify(cartItemRepository, times(1)).findCartItemByProduct(product);
        verify(cartItemRepository, times(1)).save(cartItem);

    }

    @Test
    public void testCreateCartItem_ExistingProduct() {

        Cart cart = new Cart(1L, null);
        Product product = new Product(1L, "Product 1", 10.0);
        CartItem existingCartItem = new CartItem(1L, 2, cart, product);
        CartItem newCartItem = new CartItem(2L, 1, cart, product);

        when(cartItemRepository.findCartItemByProduct(product))
                .thenReturn(Optional.of(existingCartItem));

        assertThrows(IllegalArgumentException.class,
                () -> cartItemService.createCartItem(newCartItem));

        verify(cartItemRepository, times(1)).findCartItemByProduct(product);

    }

    @Test
    public void testUpdateCartItem() {

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, null, product);

        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(cartItem)).thenReturn(cartItem);

        CartItem result = cartItemService.updateCartItem(cartItem.getId(), 5);

        assertEquals(cartItem.getId(), result.getId());
        assertEquals(5, result.getQuantity());

        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testDeleteCartItem() {
        CartItem cartItem = new CartItem();

        cartItemService.deleteCartItem(cartItem);

        verify(cartItemRepository, times(1)).delete(cartItem);
    }

    @Test
    void testDeleteAllByCartId() {
        Long cartId = 1L;

        cartItemService.deleteAllByCartId(cartId);

        verify(cartItemRepository, times(1)).deleteAllByCartId(cartId);
    }

}