define([
    "Underscore",
    "jQuery",
    "hr/hr",
    "utils/navigation"
], function(_, $, hr, Navigation) {
    var logging = hr.Logger.addNamespace("page");

    // Navigation page
    var Page = hr.View.extend({
        className: "page",
        template: "page.html",
        events: {},

        /*
         *  Unique page id
         */
        pageId: "page",

        /*
         *  Routes to this page 
         *  ex: "settings", "player/:id"
         */
        routes: null,

        /*
         *  Navigation map for this page
         *  ex: {"right": "increaseSpeed", ...}
         */
        navigation: {},

        /* Constructor */
        initialize: function() {
            Page.__super__.initialize.apply(this, arguments);
            this.isActive = false;
            this.activeList = 0;
            this.lists = [];

            // Init navigations
            this.setNavigation(this.navigation);

            // List navigation
            this.setNavigation({
                "up": function() {
                    if (this.lists[this.activeList] == null) return;
                    this.lists[this.activeList].selectionUp();
                },
                "down": function() {
                    if (this.lists[this.activeList] == null) return;
                    this.lists[this.activeList].selectionDown();
                },
                "right": function() {
                    if (this.lists[this.activeList] == null) return;
                    this.lists[this.activeList].selectionRight();
                },
                "left": function() {
                    if (this.lists[this.activeList] == null) return;
                    this.lists[this.activeList].selectionLeft();
                },
                "enter": function() {
                    if (this.lists[this.activeList] == null) return;
                    this.lists[this.activeList].openSelection();
                }
            })

            return this;
        },

        /*
         *  Set navigation
         */
        setNavigation: function(navigations) {
            _.each(navigations, function(method, key) {
                Navigation.bind(key, function() {
                    if (!this.isActive) return;
                    if (!_.isFunction(method)) method = this[method];
                    if (!method) return;
                    _.bind(method, this)();
                }, this);
            }, this);
        },

        /*
         *  Active and focus the page
         */
        active: function() {
            if (this.isActive) return this;
            logging.log("active page ", this);
            this.isActive = true;
            this.trigger("active");
            return this;
        },

        /*
         *  Desactive the page
         */
        desactive: function() {
            if (!this.isActive) return this;
            logging.log("desactive page ", this);
            this.isActive = false;
            this.trigger("desactive");
            return this;
        },

        /*
         *  Called when the page is closed
         */
        closePage: function() {
            return this;
        },

        /*
         *  Change current list
         */
        changeList: function(i) {
            this.activeList = i;
            this.trigger("lists:change", i);
            return this;
        },

        /*
         *  Define a list as main list for navigation
         */
        addList: function(list) {
            // Add list
            var listi = this.lists.push(list);
            listi = listi - 1;

            // Bind active state
            this.on("lists:change active", function() {
                if (this.activeList == listi) {
                    if (list.activeItem() == null) list.selectionRight();
                } else {
                    list.unselectAll();
                }
            }, this);

            // Bind list selection
            list.on("item:select", function(item) {
                if (this.activeList != listi) {
                    list.unselectAll();
                }
                this.active();
            }, this);
            list.on("selection:exit:up", function(item) {
                if (this.activeList == 0) {
                    this.parent.focusSearch();
                } else {
                    this.changeList(this.activeList - 1);
                }
            }, this);
            list.on("selection:exit:down", function(item) {
                if (this.activeList < (_.size(this.lists)-1)) {
                    this.changeList(this.activeList + 1);
                }
            }, this);
            return this;
        }
    });

    // In-page list element
    var PageListItem = hr.List.Item.extend({
        events: {
            "click": "select",
        },

        /*
         *  Action when the item is selected
         */
        select: function() {
            this.list.unselectAll();
            this.$el.addClass("active");
            $('html, body').animate({
                "scrollTop": this.$el.offset().top-180
            }, 600);
            this.list.trigger("item:select", this);
            return this;
        },

        /*
         *  Action when the item is unselected
         */
        unselect: function() {
            this.$el.removeClass("active");
            this.list.trigger("item:unselect", this);
            return this;
        },

        /*
         *  Action when file is opened with ENTER/SPACE
         */
        open: function() {
            return this;
        },

        /*
         *  Return true is the item is active
         */
        isActive: function(e) {
            return this.$el.hasClass("active");
        },
    });

    // In-page list
    Page.List = hr.List.extend({
        Item: PageListItem,

        /* Unselect all the items */
        unselectAll: function() {
            _.each(this.items, function(item) {
                item.unselect();
            });
            return this;
        },

         /* Get index active item */
        activeItem: function() {
            return _.reduce(this.items, function(state, item, i) {
                if (item.isActive()) {
                    return item;
                }
                return state;
            }, null);
        },

        /* Get index active item */
        activeIndex: function() {
            return _.reduce(this.getItemsList(), function(state, item, i) {
                if (item.isActive()) {
                    return i;
                }
                return state;
            }, null);
        },

        /* Return items by lines */
        itemsByLine: function() {
            return Math.floor(this.$el.width()/274);
        },

        /* Select next */
        selectionMove: function(d) {
            var items = this.getItemsList();
            var i = this.activeIndex();
            if (i == null) {
                i = 0;
            } else {
                i = i + d;
            }
            if (_.size(this.items) == 0) return this;

            if (i >= _.size(this.items)) {
                i = _.size(this.items) - 1;
                this.trigger("selection:exit:down");
            }
            if (i < 0) return this.trigger("selection:exit:up");
            items[i].select();
            return this;
        },

        /* Select right */
        selectionRight: function() {
            return this.selectionMove(1);
        },

        /* Select left */
        selectionLeft: function() {
            return this.selectionMove(-1);
        },

        /* Select up */
        selectionUp: function() {
            return this.selectionMove(-this.itemsByLine());
        },

        /* Select down */
        selectionDown: function() {
            return this.selectionMove(this.itemsByLine());
        },

        /* Open selected item */
        openSelection: function() {
            var item = this.activeItem();
            if (item == null) return this.selectionRight();
            item.open();
        }
    }, {
        Item: PageListItem
    });

    return Page;
});