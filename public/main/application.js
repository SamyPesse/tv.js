require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "utils/navigation",
    "utils/tv",
    "utils/updates",

    "views/pages",

    "views/imports",
    "ressources/imports",
], function(_, yapp, args, Navigation, TV, Updates, pages) {
    // Configure yapp
    yapp.configure(args, {
         "logLevels": {
            "requests": "error",
            "ressources": "error",
        },
    });

    // Define base application
    var Application = yapp.Application.extend({
        name: "tv.js",
        template: "main.html",
        metas: {
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        links: {
            "icon": yapp.Urls.static("images/logo_48.png")
        },
        routes: {
            "*actions": "errorPage"
        },
        events: {
            "keydown .header .search": "searchKeydown",
            "keyup .header .search": "searchKeyup",
            "click .intro": "disableTv",
            "click .close": "exit"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            this.currentPage = null;
            
            // Bind all pages
            _.each(pages, function(pageView) {
                this.addPageView(pageView);
            }, this);



            this.doSearch = _.debounce(function() {
                q = this.$(".header .search").val();
                this.router.navigate("search/:q", {
                    "q": q
                });
            }, 1000);
            return this;
        },

        finish: function() {
            // Bind ESC
            Navigation.bind('esc', function() {
                if (this.components.keyboard.isOpen()) {
                    this.blurSearch();
                } else {
                    this.errorPage();
                }
            }, this);

            // Get TV ip
            yapp.Requests.getJSON("/api/ip").done(_.bind(function(data) {
                this.$(".intro .ip").text(data.ip+":"+data.port);
            }, this));

            // Bind keyboard to search
            this.components.keyboard.bindTo(this.$(".header .search"));

            // Bind remote
            Updates.on("remote:start", function() {
                this.$(".intro").hide();
            }, this);
            Updates.on("remote:end", function() {
                this.$(".intro").show();
            }, this);

            TV.on("state", this.toggleTv, this);
            this.toggleTv();

            return Application.__super__.finish.apply(this, arguments);
        },

        /*
         *  Add page view to routing
         *  @pageView : page view to add
         */
        addPageView: function(pageView) {
            var routeName, uri, pageid, args, page;

            routes = _.isArray(pageView.prototype.routes) ? pageView.prototype.routes : [pageView.prototype.routes];
            routeName = "page:"+pageView.prototype.pageId;

            // Manage routes
            this.on("route:"+routeName, function() {
                args = _.values(arguments);
                if (this.currentPage != null) this.currentPage.closePage();
                this.currentPage = new pageView({
                    args: args
                }, this);
                this.$(".body").empty();
                this.currentPage.$el.appendTo(this.$(".body"));
                this.currentPage.render();
            }, this);

            // Bind all routes
            _.each(routes, function(route) {
                this.route(route, routeName);
            }, this);
            return this;
        },

        /*
         *  Active current page
         */
        activePage: function() {
            if (this.currentPage != null) this.currentPage.active();
            return this;
        },

        /*
         *  Desactive current page
         */
        desactivePage: function() {
            if (this.currentPage != null) this.currentPage.desactive();
            return this;
        },

        /*
         *  Page changes
         */
        errorPage: function() {
            yapp.History.navigate("home");
        },

        /*
         *  Focus on search bar : desactive current page
         */
        focusSearch: function() {
            this.$(".header .search").focus();
            $('html, body').animate({
                "scrollTop": 0
            }, 600);
            this.desactivePage();
        },

        /*
         *  Blur from search bar : active current page
         */
        blurSearch: function() {
            this.$(".header .search").blur();
            this.activePage();
        },

        /*
         *  Search input : keydown on search bar
         *      -> down|enter : go to list  
         */
        searchKeyup: function(e) {
            var listCodes = [
                13 /* enter */,
                40 /* down */
            ];
            var code = (e.keyCode ? e.keyCode : e.which);
            if (!TV.check()) {
                if (code == 27 /* esc */) {
                    this.router.navigate("home");
                } else if (_.contains(listCodes, code)) {
                    this.blurSearch();
                }
            }
            this.doSearch();
        },

        /*
         *  Keydown on search input
         *      -> on tv : prevent default
         */
        searchKeydown: function(e) {
            if (TV.check()) {
                e.preventDefault();
            }
        },

        /*
         *  Set search text
         */
        setSearchQuery: function(q) {
            this.$(".header .search").val(q);
            return this;
        },

        /* (event) Disable tv */
        disableTv: function() {
            TV.toggle(false);
            return this;
        },

        /* (event) TV toggled */
        toggleTv: function() {
            this.$(".close").toggle(!TV.enabled);
            if (TV.enabled == false) this.$(".intro").hide();
        },

        /*
         *  Exit application
         */
        exit: function(e) {
            if (e != null) e.preventDefault();
            yapp.Requests.post("/api/exit")
            window.close();
        },
    });

    var app = new Application();
    app.run();
});