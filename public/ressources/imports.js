define([
    "yapp/yapp",
    "text!ressources/i18n/en.json",
], function(yapp) {

    // Define loader for templates
    yapp.Ressources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

    // Define loader for i18n
    yapp.Ressources.addNamespace("i18n", {
        loader: "require",
        base: "ressources/i18n",
        extension: ".json"
    });

    yapp.I18n.loadLocale(["en"]);

    return arguments;
});