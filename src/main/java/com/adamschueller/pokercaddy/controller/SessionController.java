package com.adamschueller.pokercaddy.controller;

import com.adamschueller.pokercaddy.controller.response.UserResponse;
import com.adamschueller.pokercaddy.db.SessionRepository;
import com.adamschueller.pokercaddy.db.UserRepository;
import com.adamschueller.pokercaddy.model.Session;
import com.adamschueller.pokercaddy.model.User;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.Optional;

import static com.adamschueller.pokercaddy.PokerCaddyApplication.activeSessions;

@Controller
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @JsonComponent
    static class CreateSessionRequest {
        @Getter String userSessionId;
        @Getter long date;
        @Getter String location;
        @Getter float smallBlind;
        @Getter float bigBlind;
        @Getter float straddle;
        @Getter float moneyIn;
        @Getter float moneyOut;
    }

    @PostMapping("/session/create")
    public @ResponseBody Optional<UserResponse> createSession(@RequestBody CreateSessionRequest createSessionRequest) {
        String userSessionId = createSessionRequest.userSessionId;
        if (activeSessions.containsKey(userSessionId)) {
            User user = activeSessions.get(userSessionId);
            Session session = new Session();
            session.setDate(new Date(createSessionRequest.date));
            session.setLocation(createSessionRequest.location);
            session.setSmallBlind(createSessionRequest.smallBlind);
            session.setBigBlind(createSessionRequest.bigBlind);
            session.setStraddle(createSessionRequest.straddle);
            session.setMoneyIn(createSessionRequest.moneyIn);
            session.setMoneyOut(createSessionRequest.moneyOut);
            user.getSessions().add(session);
            sessionRepository.save(session);
            userRepository.save(user);
            return Optional.of(new UserResponse(userSessionId, user.getSessions(), user.getBankroll()));
        }
        return Optional.empty();
    }

    @JsonComponent
    static class DeleteSessionRequest {
        @Getter String userSessionId;
        @Getter int sessionId;
    }

    @PostMapping("/session/delete")
    public @ResponseBody Optional<UserResponse> deleteSession(@RequestBody DeleteSessionRequest deleteSessionRequest) {
        String userSessionId = deleteSessionRequest.userSessionId;
        if (activeSessions.containsKey(userSessionId)) {
            User user = activeSessions.get(userSessionId);
            user.getSessions().removeIf((s) -> s.getId().equals(deleteSessionRequest.sessionId));
            userRepository.save(user);
            return Optional.of(new UserResponse(userSessionId, user.getSessions(), user.getBankroll()));
        }
        return Optional.empty();
    }

    @JsonComponent
    static class EditSessionRequest {
        @Getter String userSessionId;
        @Getter int sessionId;
        @Getter long date;
        @Getter String location;
        @Getter float smallBlind;
        @Getter float bigBlind;
        @Getter float straddle;
        @Getter float moneyIn;
        @Getter float moneyOut;
    }

    @PostMapping("/session/edit")
    public @ResponseBody Optional<UserResponse> editSession(@RequestBody EditSessionRequest editSessionRequest) {
        String userSessionId = editSessionRequest.userSessionId;
        if (activeSessions.containsKey(userSessionId)) {
            User user = activeSessions.get(userSessionId);
            Optional<Session> optionalSession = user.getSessions().stream()
                    .filter((s) -> s.getId().equals(editSessionRequest.sessionId))
                    .findFirst();
            if (optionalSession.isPresent()) {
                Session session = optionalSession.get();
                Optional<Long> dateOptional = Optional.ofNullable(editSessionRequest.date);
                Optional<String> locationOptional = Optional.ofNullable(editSessionRequest.location);
                Optional<Float> smallBlindOptional = Optional.ofNullable(editSessionRequest.smallBlind);
                Optional<Float> bigBlindOptional = Optional.ofNullable(editSessionRequest.bigBlind);
                Optional<Float> straddleOptional = Optional.ofNullable(editSessionRequest.straddle);
                Optional<Float> moneyInOptional = Optional.ofNullable(editSessionRequest.moneyIn);
                Optional<Float> moneyOutOptional = Optional.ofNullable(editSessionRequest.moneyOut);

                if (dateOptional.isPresent())
                    session.setDate(new Date(dateOptional.get()));
                if (locationOptional.isPresent())
                    session.setLocation(locationOptional.get());
                if (smallBlindOptional.isPresent())
                    session.setSmallBlind(smallBlindOptional.get());
                if (bigBlindOptional.isPresent())
                    session.setBigBlind(bigBlindOptional.get());
                if (straddleOptional.isPresent())
                    session.setStraddle(straddleOptional.get());
                if (moneyInOptional.isPresent())
                    session.setMoneyIn(moneyInOptional.get());
                if (moneyOutOptional.isPresent())
                    session.setMoneyOut(moneyOutOptional.get());

                sessionRepository.save(session);
                userRepository.save(user);

                return Optional.of(new UserResponse(userSessionId, user.getSessions(), user.getBankroll()));
            }
        }
        return Optional.empty();
    }
}
