package com.berk.server.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;
    private MockMvc mockMvc;
    private List<User> mockUsers;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        mockUsers = Arrays.asList(new User(1L, "User1_fn", "User1_ln", "user1@gmail.com", "123"),
                new User(2L, "User2_fn", "User2_ln", "user2@gmail.com", "1234"));
    }

    @Test
    public void testSignUp_NonExistingEmail() throws Exception{
        User newUser = new User(3L, "User3_fn", "User3_ln", "user3@gmail.com");
        String newUser_fullName = newUser.getFirstName() + " " +  newUser.getLastName();

        when(userService.signUpUser(newUser)).thenReturn(newUser);

        ObjectMapper mapper = new ObjectMapper();
        String userJson = mapper.writeValueAsString(newUser);

        mockMvc.perform(post("/api/user/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(content().string(newUser_fullName + " signed up successfully"));

        verify(userService, times(1)).signUpUser(newUser);
    }

    @Test
    public void testSignUp_ExistingEmail() throws Exception{
        User newUser = new User(3L, "User3_fn", "User3_ln", "user1@gmail.com");

        when(userService.signUpUser(newUser))
                .thenThrow(new IllegalArgumentException("Email is already taken"));

        ObjectMapper mapper = new ObjectMapper();
        String userJson = mapper.writeValueAsString(newUser);

        mockMvc.perform(post("/api/user/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Email is already taken"));

        verify(userService, times(1)).signUpUser(newUser);
    }

    // TODO check if the user has a cart
    @Test
    public void testLogin_CorrectCredentials() throws Exception{
        User userInDB = mockUsers.get(0);
        User loginCredentials = new User(userInDB.getEmail(), userInDB.getPassword());

        when(userService.loginUser(loginCredentials))
                .thenReturn(userInDB);

        ObjectMapper mapper = new ObjectMapper();
        String userJson = mapper.writeValueAsString(loginCredentials);

        mockMvc.perform(post("/api/user/login")
                        .content(userJson)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userInDB.getId()))
                .andExpect(jsonPath("$.firstName").value(userInDB.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(userInDB.getLastName()))
                .andExpect(jsonPath("$.email").value(userInDB.getEmail()));

        verify(userService, times(1)).loginUser(loginCredentials);
    }

    @Test
    public void testLogin_WrongCredentials() throws Exception {
        User userInDB = mockUsers.get(0);
        User loginCredentials = new User(userInDB.getEmail(), "wrong_password");

        when(userService.loginUser(loginCredentials))
                .thenReturn(null);

        ObjectMapper mapper = new ObjectMapper();
        String userJson = mapper.writeValueAsString(loginCredentials);

        mockMvc.perform(post("/api/user/login")
                        .content(userJson)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Email or password is wrong"));

        verify(userService, times(1)).loginUser(loginCredentials);
    }
}