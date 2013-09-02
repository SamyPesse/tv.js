define([
    "yapp/yapp",
], function(yapp) {

    // Define loader for templates
    yapp.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    return arguments;
});