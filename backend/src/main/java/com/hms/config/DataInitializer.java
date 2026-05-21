package com.hms.config;

import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Default admin user created: admin / admin123");
            }

            if (!userRepository.existsByUsername("receptionist")) {
                User receptionist = new User();
                receptionist.setUsername("receptionist");
                receptionist.setPassword(passwordEncoder.encode("receptionist123"));
                receptionist.setRole(Role.RECEPTIONIST);
                userRepository.save(receptionist);
                System.out.println("Default receptionist user created: receptionist / receptionist123");
            }
        };
    }
}
