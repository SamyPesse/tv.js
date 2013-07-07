define([
    "yapp/yapp",
], function(yapp) {

    // Define loader for templates
    yapp.Ressources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    return arguments;
});