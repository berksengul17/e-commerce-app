package com.berk.server.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private List<Product> mockProducts;

    @BeforeEach
    void setUp() {
        mockProducts = Arrays.asList(new Product(1L, "Product 1", 10.0),
                                        new Product(2L, "Product 2", 20.0));
    }

    @Test
    public void testGetAllProduct() {

        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productService.getAllProducts();

        assertEquals(mockProducts.get(0), result.get(0));
        assertEquals(mockProducts.get(1), result.get(1));

        verify(productRepository, times(1)).findAll();
    }

    @Test
    public void testGetProductById_ExistingId() {

        Product product = mockProducts.get(0);
        Long productId = product.getId();

        when(productRepository.findById(productId))
                .thenReturn(Optional.of(product));

        Product result = productService.getProductById(productId);

        assertEquals(product, result);

        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    public void testGetProductById_NonExistingId() {

        Long nonExistingId = 100L;

        when(productRepository.findById(nonExistingId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> productService.getProductById(nonExistingId));

        verify(productRepository, times(1)).findById(nonExistingId);
    }
}