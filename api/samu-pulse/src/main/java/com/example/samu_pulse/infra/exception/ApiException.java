package com.example.samu_pulse.infra.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
