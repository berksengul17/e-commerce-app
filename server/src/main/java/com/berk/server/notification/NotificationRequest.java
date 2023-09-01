package com.berk.server.notification;

import com.berk.server.token.Token;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private Token token;
    private NotificationInfo notificationInfo;
}