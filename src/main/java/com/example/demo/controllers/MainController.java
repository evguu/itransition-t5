package com.example.demo.controllers;

import com.example.demo.domain.Drawable;
import com.example.demo.domain.IdWrapper;
import com.example.demo.domain.StringWrapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class MainController {

    private static final List<Drawable> drawables = new CopyOnWriteArrayList<>() {{
        add(new Drawable("<div class=\"tools-text draggable\" style=\"position:relative;top:50px;left:50px;\">TEST ELEMENT</div>"));
        add(new Drawable("<div class=\"tools-text draggable\" style=\"position:relative;top:70px;left:50px;\">TEST ELEMENT</div>"));
        add(new Drawable("<div class=\"tools-text draggable\" style=\"position:relative;top:90px;left:50px;\">TEST ELEMENT</div>"));
        add(new Drawable("<div class=\"tools-text draggable\" style=\"position:relative;top:110px;left:50px;\">TEST ELEMENT</div>"));
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
    public IdWrapper delElement(@RequestBody IdWrapper id, Map<String, Object> model) {
        drawables.removeIf(drawable -> drawable.getId().equals(id.getId()));
        return id;
    }

    @MessageMapping("/add")
    @SendTo("/recv/add")
    public Drawable addElement(StringWrapper element, Map<String, Object> model) {
        Drawable drawable = new Drawable(element.getStr());
        drawables.add(drawable);
        return drawable;
    }
}
