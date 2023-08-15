package com.berk.server.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private MockMvc mockMvc;

    private List<Product> mockProducts;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
        mockProducts = Arrays.asList(new Product(1L, "Product 1", 10.0),
                new Product(2L, "Product 2", 20.0));
    }

    @Test
    public void testGetAllProducts() throws Exception{

        when(productService.getAllProducts()).thenReturn(mockProducts);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Product 1"))
                .andExpect(jsonPath("$[0].price").value("10.0"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Product 2"))
                .andExpect(jsonPath("$[1].price").value("20.0"));

        verify(productService, times(1)).getAllProducts();
    }

    @Test
    public void testGetProductById_ExistingId() throws Exception{

        Product product = mockProducts.get(0);
        Long productId = product.getId();

        when(productService.getProductById(productId)).thenReturn(product);

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Product 1"))
                .andExpect(jsonPath("$.price").value("10.0"));

        verify(productService, times(1)).getProductById(productId);
    }

    @Test
    public void testGetProductById_NonExistingId() throws Exception {

        Long nonExistingId = 100L;
        String exceptionMessage = "Product with id " + nonExistingId + " is not found";

        when(productService.getProductById(nonExistingId))
                .thenThrow(new IllegalArgumentException(exceptionMessage));

        mockMvc.perform(get("/api/products/{id}", nonExistingId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(exceptionMessage));

        verify(productService, times(1)).getProductById(nonExistingId);
    }

}