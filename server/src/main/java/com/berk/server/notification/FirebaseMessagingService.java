package com.berk.server.notification;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;
import com.berk.server.token.Token;

import java.util.ArrayList;
import java.util.List;

@Service
public class FirebaseMessagingService {

    private final FirebaseMessaging firebaseMessaging;

    public FirebaseMessagingService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }
    public String sendNotification(Token token, NotificationInfo notificationInfo) throws FirebaseMessagingException {

        Notification notification = Notification
                .builder()
                .setTitle(notificationInfo.getTitle())
                .setBody(notificationInfo.getBody())
                .build();

        Message message = Message
                .builder()
                .setToken(token.getToken())
                .setNotification(notification)
                .build();

        return firebaseMessaging.send(message);
        /*
                .putAllData(notificationInfo.getData())
        List<String> strTokens = new ArrayList<>();
        for (Token token : tokens) {
            strTokens.add(token.getToken());
        }

        Notification notification = Notification
                .builder()
                .setTitle(notificationInfo.getTitle())
                .setBody(notificationInfo.getBody())
                .setImage(notificationInfo.getImage())
                .build();

        MulticastMessage multicastMessage = MulticastMessage.builder()
                .setNotification(notification)
                .addAllTokens(strTokens)  // List of registration tokens
                .build();

        // Send the multicast message
        BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(multicastMessage);

        return response.getSuccessCount();*/
    }

}