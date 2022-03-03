package com.adamschueller.pokercaddy.controller;

import com.adamschueller.pokercaddy.controller.response.UserResponse;
import com.adamschueller.pokercaddy.model.Session;
import com.adamschueller.pokercaddy.model.User;
import com.adamschueller.pokercaddy.db.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.adamschueller.pokercaddy.PokerCaddyApplication.activeSessions;

@Controller
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @JsonComponent
    static class CreateUserRequest {
        @Getter String username;
        @Getter String password;
        @Getter float initBankroll;
    }

    @PostMapping("/user/create")
    public @ResponseBody UserResponse createUser(@RequestBody CreateUserRequest createUserRequest) {
        String encryptedPassword = BCrypt.hashpw(createUserRequest.password, BCrypt.gensalt());
        User user = new User();
        user.setUsername(createUserRequest.username);
        user.setPassword(encryptedPassword);
        user.setBankroll(createUserRequest.initBankroll);
        userRepository.save(user);

        String sessionId = UUID.randomUUID().toString();
        activeSessions.put(sessionId, user);

        return new UserResponse(sessionId, user.getSessions(), user.getBankroll());
    }

    @JsonComponent
    static class LoginUserRequest {
        @Getter String username;
        @Getter String password;
    }

    @PostMapping("/user/login")
    public @ResponseBody Optional<UserResponse> loginUser(@RequestBody LoginUserRequest loginUserRequest) {
        User user = userRepository.findByUsername(loginUserRequest.username);
        if (user != null && BCrypt.checkpw(loginUserRequest.password, user.getPassword())) {
            String sessionId = UUID.randomUUID().toString();
            activeSessions.put(sessionId, user);
            return Optional.of(new UserResponse(sessionId, user.getSessions(), user.getBankroll()));
        }
        return Optional.empty();
    }

    @JsonComponent
    static class GetUserRequest {
        @Getter String sessionId;
    }

    @PostMapping("/user/get")
    public @ResponseBody Optional<UserResponse> getUser(@RequestBody GetUserRequest getUserRequest) {
        if (activeSessions.containsKey(getUserRequest.sessionId)) {
            User user = activeSessions.get(getUserRequest.sessionId);
            return Optional.of(new UserResponse(getUserRequest.sessionId, user.getSessions(), user.getBankroll()));
        }
        return Optional.empty();
    }
}
