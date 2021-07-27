package com.example.demo.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Component;

@Component
public class Sender {
    private static final ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

    public static String toJSON(Object obj){
        try {
            return ow.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }


}
