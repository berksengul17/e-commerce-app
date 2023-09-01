package com.berk.server.notification;

import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/notifications/send-notification")
public class FirebaseMessagingController {

    private final FirebaseMessagingService firebaseMessagingService;

    public FirebaseMessagingController(FirebaseMessagingService firebaseMessagingService) {
        this.firebaseMessagingService = firebaseMessagingService;
    }

    @PostMapping
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest notificationRequest){
        try {
            return ResponseEntity.ok(firebaseMessagingService.sendNotification(notificationRequest.getToken(),
                                                                notificationRequest.getNotificationInfo()));
        } catch (FirebaseMessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
