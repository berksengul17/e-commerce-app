package com.berk.server.cart;

import com.berk.server.cartItem.CartItem;
import com.berk.server.product.Product;
import com.berk.server.user.User;
import com.berk.server.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CartControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private CartService cartService;
    @InjectMocks
    private CartController cartController;

    private MockMvc mockMvc;
    private List<Cart> mockCarts;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(cartController).build();
        mockCarts = Arrays.asList(new Cart(1L, new User(1L, "John", "Doe", "john@gmail.com")),
                new Cart(2L, new User(2L, "Jack", "Doe", "jack@gmail.com")));
    }

    @Test
    public void testGetCartByUserId_ExistingId() throws Exception{
        Cart cart = mockCarts.get(0);

        Long userId = 1L;

        when(cartService.getCartByUserId(userId)).thenReturn(cart);

        mockMvc.perform(get("/api/carts/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(cart.getId()));

        verify(cartService, times(1)).getCartByUserId(userId);

    }

    @Test
    public void testGetCartByUserId_NonExistingId() throws Exception{
        Long userId = 100L;
        String exceptionMessage = "Cart associated with the user id " + userId + " is not found.";

        when(cartService.getCartByUserId(userId))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(get("/api/carts/{userId}", userId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).getCartByUserId(userId);

    }

    @Test
    public void testGetTotalPrice_ExistingId() throws Exception{
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

        when(cartService.calculateTotalCartPrice(userId)).thenReturn(60.0);

        mockMvc.perform(get("/api/carts/{userId}/total-price", userId))
                .andExpect(status().isOk())
                .andExpect(content().string("60.0"));

        verify(cartService, times(1)).calculateTotalCartPrice(userId);
    }

    @Test
    public void testGetTotalPrice_NonExistingId() throws Exception{
        Long nonExistingId = 100L;
        String exceptionMessage = "Cart associated with the user id " + nonExistingId + " is not found.";

        when(cartService.calculateTotalCartPrice(nonExistingId))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(get("/api/carts/{userId}/total-price", nonExistingId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).calculateTotalCartPrice(nonExistingId);
    }


    @Test
    public void testCreateCart_ExistingUser_NoCart() throws Exception {

        User user = new User(3L, "Berk", "Şengül", "berk@gmail.com");
        Cart cart = new Cart(3L, user);

        when(userService.getUserById(user.getId())).thenReturn(user);
        when(cartService.createCart(user)).thenReturn(cart);

        mockMvc.perform(post("/api/carts/{userId}/create-cart", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(cart.getId()));

        assertEquals(user, cart.getUser());

        verify(userService, times(1)).getUserById(user.getId());
        verify(cartService, times(1)).createCart(user);
    }

    @Test
    public void testCreateCart_ExistingUser_HasCart() throws Exception {

        Cart cart = mockCarts.get(0);
        User user = cart.getUser();

        when(userService.getUserById(user.getId())).thenReturn(user);
        when(cartService.createCart(user)).thenReturn(null);

        mockMvc.perform(post("/api/carts/{userId}/create-cart", user.getId()))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("User with id " + user.getId() + " already has a cart"));

        verify(userService, times(1)).getUserById(user.getId());
        verify(cartService, times(1)).createCart(user);
    }

    @Test
    public void testCreateCart_NonExistingUser() throws Exception {

        Long nonExistingId = 100L;
        String exceptionMessage = "User with the id " + nonExistingId  + " is not found.";

        when(userService.getUserById(nonExistingId))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(post("/api/carts/{userId}/create-cart", nonExistingId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(userService, times(1)).getUserById(nonExistingId);
    }

    @Test
    public void testAddItemToCart_ExistingId() throws Exception {

        Cart cart = mockCarts.get(0);
        Long userId = cart.getUser().getId();

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);


        when(cartService.addItemToCart(userId, product.getId()))
                .thenReturn(cartItem);

        mockMvc.perform(post("/api/carts/{userId}/add/{productId}", userId, product.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(cartItem.getId()))
                .andExpect(jsonPath("$.quantity").value(cartItem.getQuantity()))
                .andExpect(jsonPath("$.product").value(cartItem.getProduct()));

        verify(cartService, times(1)).addItemToCart(userId, product.getId());
    }

    @Test
    public void testAddItemToCart_NonExistingId() throws Exception {

        Long nonExistingId = 100L;
        String exceptionMessage = "User with the id " + nonExistingId  + " is not found.";

        Product product = new Product(1L, "Product 1", 10.0);

        when(cartService.addItemToCart(nonExistingId, product.getId()))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(post("/api/carts/{userId}/add/{productId}", nonExistingId, product.getId()))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).addItemToCart(nonExistingId, product.getId());
    }

    @Test
    public void testRemoveItemFromCart_ExistingId() throws Exception {

        // cart
        Cart cart = mockCarts.get(0);
        Long userId = cart.getUser().getId();

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);

        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem);

        cart.setCartItems(cartItems);

        // updated cart
        Cart updatedCart = new Cart(cart.getId(), cart.getUser());
        CartItem updatedCartItem = new CartItem(1L, 1, cart, product);

        List<CartItem> updatedCartItems = new ArrayList<>();
        updatedCartItems.add(updatedCartItem);

        updatedCart.setCartItems(updatedCartItems);

        when(cartService.removeItemFromCart(userId, cartItem.getId()))
                .thenReturn(updatedCart);

        ResultActions result = mockMvc.perform(
                delete("/api/carts/{userId}/remove/{itemId}", userId, cartItem.getId()));

        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        MvcResult mvcResult = result.andReturn();
        String responseJson = mvcResult.getResponse().getContentAsString();
        ObjectMapper mapper = new ObjectMapper();

        Cart responseCart = mapper.readValue(responseJson, Cart.class);
        List<CartItem> responseCartItems = responseCart.getCartItems();
        CartItem responseCartItem = responseCartItems.get(0);

        assertEquals(updatedCart.getId(), responseCart.getId());
        assertEquals(updatedCartItems.size(), responseCartItems.size());
        assertEquals(updatedCartItem.getQuantity(), responseCartItem.getQuantity());
        assertEquals(updatedCartItem.getProduct(), responseCartItem.getProduct());

        verify(cartService, times(1)).removeItemFromCart(userId, cartItem.getId());
    }

    @Test
    public void testRemoveItemFromCart_NonExistingId() throws Exception {

        Cart cart = mockCarts.get(0);
        Long nonExistingId = 100L;
        String exceptionMessage = "User with the id " + nonExistingId  + " is not found.";

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);

        when(cartService.removeItemFromCart(nonExistingId, cartItem.getId()))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(delete("/api/carts/{userId}/remove/{itemId}", nonExistingId, cartItem.getId()))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).removeItemFromCart(nonExistingId, cartItem.getId());
    }

    @Test
    public void testDeleteItemFromCart_ExistingId() throws Exception{

        // cart
        Cart cart = mockCarts.get(0);
        Long userId = cart.getUser().getId();

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);

        List<CartItem> cartItems = new ArrayList<>();
        cartItems.add(cartItem);

        cart.setCartItems(cartItems);

        // updated cart
        Cart updatedCart = new Cart(cart.getId(), cart.getUser());
        List<CartItem> updatedCartItems = new ArrayList<>();

        updatedCart.setCartItems(updatedCartItems);

        when(cartService.deleteItemFromCart(userId, cartItem.getId()))
                .thenReturn(updatedCart);

        ResultActions result = mockMvc.perform(
                delete("/api/carts/{userId}/delete/{itemId}", userId, cartItem.getId()));

        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        MvcResult mvcResult = result.andReturn();
        String responseJson = mvcResult.getResponse().getContentAsString();
        ObjectMapper mapper = new ObjectMapper();

        Cart responseCart = mapper.readValue(responseJson, Cart.class);
        List<CartItem> responseCartItems = responseCart.getCartItems();

        assertEquals(updatedCart.getId(), responseCart.getId());
        assertEquals(0, responseCartItems.size());

        verify(cartService, times(1)).deleteItemFromCart(userId, cartItem.getId());
    }

    @Test
    public void testDeleteItemFromCart_NonExistingId() throws Exception {

        Cart cart = mockCarts.get(0);
        Long nonExistingId = 100L;
        String exceptionMessage = "User with the id " + nonExistingId  + " is not found.";

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, cart, product);

        when(cartService.deleteItemFromCart(nonExistingId, cartItem.getId()))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(delete("/api/carts/{userId}/delete/{itemId}", nonExistingId, cartItem.getId()))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).deleteItemFromCart(nonExistingId, cartItem.getId());
    }

    @Test
    public void testClearCart_ExistingId() throws Exception {
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

        doNothing().when(cartService).clearCart(userId);

        mockMvc.perform(delete("/api/carts/{userId}/clear-cart", userId))
                .andExpect(status().isOk())
                .andExpect(content().string("Cart has been cleared."));
    }

    @Test
    public void testClearCart_NonExistingId() throws Exception {

        Long nonExistingId = 100L;
        String exceptionMessage = "User with the id " + nonExistingId  + " is not found.";

        doThrow(new IllegalArgumentException(exceptionMessage))
                .when(cartService).clearCart(nonExistingId);

        mockMvc.perform(delete("/api/carts/{userId}/clear-cart", nonExistingId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(cartService, times(1)).clearCart(nonExistingId);
    }
}