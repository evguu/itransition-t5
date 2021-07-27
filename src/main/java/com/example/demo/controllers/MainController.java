package com.example.demo.controllers;

import com.example.demo.pojos.drawables.Drawable;
import com.example.demo.utils.Sender;
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
        return "index";
    }

    @GetMapping("/data")
    public @ResponseBody List<Drawable> getAll(Map<String, Object> model) {
        return drawables;
    }

    @DeleteMapping("/data")
    public @ResponseBody String delElement(Integer id, Map<String, Object> model) {
        drawables.removeIf(drawable -> drawable.getId().equals(id));
        return "{}";
    }

    @PostMapping("/data")
    public @ResponseBody
    String addElement(@RequestBody String json, Map<String, Object> model) {
        drawables.add(new Drawable(json));
        return "{}";
    }
}
