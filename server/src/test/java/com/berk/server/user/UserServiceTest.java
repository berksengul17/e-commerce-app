package com.berk.server.user;

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
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private List<User> mockUsers;

    @BeforeEach
    public void setUp() {
        mockUsers = Arrays.asList(new User(1L, "User1_fn", "User1_ln", "user1@gmail.com", "123"),
                                    new User(2L, "User2_fn", "User2_ln", "user2@gmail.com", "1234"));
    }

    @Test
    public void testGetUserById_ExistingId() {
        User mockUser = mockUsers.get(0);
        Long mockUserId = mockUser.getId();

        when(userRepository.findById(mockUserId))
                .thenReturn(Optional.of(mockUser));

        User user = userService.getUserById(mockUserId);

        assertEquals(mockUser.getFirstName(), user.getFirstName());
        assertEquals(mockUser.getLastName(), user.getLastName());
        assertEquals(mockUser.getEmail(), user.getEmail());
        assertEquals(mockUser.getPassword(), user.getPassword());

        verify(userRepository, times(1)).findById(mockUserId);
    }

    @Test
    public void testGetByUserId_NonExistingId() {
        long nonExistingId = 100L;
        when(userRepository.findById(nonExistingId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> userService.getUserById(nonExistingId));
    }

    @Test
    public void testSignUpUser_NonExistingEmail() {
        User newUser = new User(3L, "User3_fn", "User3_ln", "user3@gmail.com");

        when(userRepository.findByEmail(newUser.getEmail()))
                .thenReturn(Optional.empty());
        when(userRepository.save(newUser)).thenReturn(newUser);

        User result = userService.signUpUser(newUser);

        assertEquals(newUser.getId(), result.getId());
        assertEquals(newUser.getFirstName(), result.getFirstName());
        assertEquals(newUser.getLastName(), result.getLastName());
        assertEquals(newUser.getEmail(), result.getEmail());
        assertNotNull(result.getCart());

        verify(userRepository, times(1)).findByEmail(newUser.getEmail());
    }

    @Test
    public void testSignUpUser_ExistingEmail() {
        User newUser = new User(3L, "User3_fn", "User3_ln", "user1@gmail.com");

        when(userRepository.findByEmail(newUser.getEmail()))
                .thenReturn(Optional.of(newUser));

        assertThrows(IllegalArgumentException.class, () -> userService.signUpUser(newUser));
    }

    @Test
    public void testLoginUser_CorrectCredentials() {
        User userInDB = mockUsers.get(0);
        User loginCredentials = new User(userInDB.getEmail(), userInDB.getPassword());

        when(userRepository.findByEmail(userInDB.getEmail()))
                .thenReturn(Optional.of(userInDB));

        User result = userService.loginUser(loginCredentials);

        assertEquals(userInDB.getId(), result.getId());
        assertEquals(userInDB.getFirstName(), result.getFirstName());
        assertEquals(userInDB.getLastName(), result.getLastName());
        assertEquals(userInDB.getEmail(), result.getEmail());
        assertEquals(userInDB.getCart(), result.getCart());

        verify(userRepository, times(1)).findByEmail(userInDB.getEmail());
    }

    @Test
    public void testLoginUser_WrongCredentials() {
        User userInDB = mockUsers.get(0);
        User loginCredentials = new User(userInDB.getEmail(), "wrong_password");

        when(userRepository.findByEmail(userInDB.getEmail()))
                .thenReturn(Optional.of(userInDB));

        User result = userService.loginUser(loginCredentials);

        assertNull(result);

        verify(userRepository, times(1)).findByEmail(userInDB.getEmail());
    }
}
