package com.example.demo.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.stereotype.Component;

@Component
public class Sender {
    private static final ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

    private static class Sendable {
        private final Object object;
        private final String type;

        public Sendable(Object object) {
            this.object = object;
            this.type = object.getClass().getSimpleName();
        }

        public Object getObject() {
            return object;
        }

        public Object getType() {
            return type;
        }
    }

    public static String toJSON(Object obj){
        try {
            return ow.writeValueAsString(
                    new Sendable(obj)
            );
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }


}
