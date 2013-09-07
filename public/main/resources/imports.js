define([
    "hr/hr",
], function(hr) {

    // Define loader for templates
    hr.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    return arguments;
});