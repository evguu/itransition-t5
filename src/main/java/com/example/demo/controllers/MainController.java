package com.example.demo.controllers;

import com.example.demo.domain.Drawable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class MainController {

    private static final List<Drawable> drawables = new ArrayList<>()
    {{
        add(new Drawable("{\"works\":true}"));
    }};

    @GetMapping("/")
    public String greeting(Map<String, Object> model) {
        return "index.html";
    }

    @GetMapping("/data")
    public @ResponseBody List<Drawable> getAll(Map<String, Object> model) {
        return drawables;
    }

    @MessageMapping("/del")
    @SendTo("/recv/del")
    public Integer delElement(Integer id, Map<String, Object> model) {
        drawables.removeIf(drawable -> drawable.getId().equals(id));
        return id;
    }

    @MessageMapping("/add")
    @SendTo("/recv/add")
    public Drawable addElement(@RequestBody String json, Map<String, Object> model) {
        Drawable drawable = new Drawable(json);
        drawables.add(drawable);
        return drawable;
    }
}
