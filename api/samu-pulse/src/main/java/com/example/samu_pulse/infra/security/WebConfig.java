package com.example.samu_pulse.infra.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.Arrays;
import java.util.stream.Stream;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${SITE_URL}")
    private String siteUrl;

    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(Stream.concat(Arrays.stream(allowedOrigins), Stream.of(
                        siteUrl,
                        "https://samu-pulse.lat",
                        "https://www.samu-pulse.lat"
                )).map(String::trim).filter(origin -> !origin.isEmpty()).distinct().toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
