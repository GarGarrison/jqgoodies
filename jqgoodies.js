default_select_settings = {
    "arrow_color": "black",
    "option_hover_color": "black", 
    "option_hover_background": "#e5e5e5"
}
default_shadow_settings = {
    "max-width": "700px"
}
function selectArrowToggle(obj) {
    obj.each(function(){
        obj_i = $(this);
        text = obj_i.text();
        newtext = "arrow_drop_up";
        if (text == "arrow_drop_up") newtext = "arrow_drop_down";
        obj_i.text(newtext);
    })
}
function hideVisibleCustomSelect() {
    body = $(".custom-select-body:visible");
    head = body.prev(".custom-select-head");
    selectArrowToggle(head.find("i"));
    body.slideUp('fast');
}
function toFilterCustomSelects(opt){
    wrapper = opt.closest(".custom-select-wrapper");
    filter_relation = wrapper.attr("data-filter-relation-id");
    role = wrapper.attr("data-filter-role");
    if (role == "donor") {
        obj = $(".custom-select-wrapper[data-filter-relation-id='" + filter_relation + "'][data-filter-role='object']");
        childrens = opt.attr("data-children");
        if (!childrens) obj.find(".custom-select-option").removeClass("filtered");
        else {
            obj.find(".custom-select-option").addClass("filtered");
            obj.find(".custom-select-option:first").removeClass("filtered");
            obj.find(".custom-select-option[data-parent='" + childrens + "']").removeClass("filtered");
            obj.find(".custom-select-option[data-parent='" + childrens + "']:last").css({"border": "none"});
        }

    }
}
$.fn.initCustomSelect = function(settings){
    filter_attrs = ["data-filter", "data-filter-role", "data-filter-relation-id"];
    options_attrs = ["data-children", "data-parent"];
    for (var k in settings) { default_select_settings[k] = settings[k] }
    this.each(function(i){
        iselect = $(this);
        init_val = iselect.children("option:selected").text();
        wrapper = $('<div class="custom-select-wrapper"></div>');
        head = $('<div class="custom-select-head"><span class="custom-select-head-value"></span><i class="material-icons select-arrow">arrow_drop_down</i></div>');
        head.find(".custom-select-head-value").text(init_val);
        head.addClass("valign-wrapper");
        head.find(".custom-select-head-value").addClass("valign");
        head.find(".select-arrow").addClass("valign").css({"color": default_select_settings["arrow_color"]});
        filter_attrs.forEach(function(i){
            wrapper.attr(i, iselect.attr(i));
        })
        body = $('<div class="custom-select-body"></div>');

        iselect.children("option").each(function(i){
            ioption = $(this);
            option = $('<div class="custom-select-option"></div>');
            if (i == 0) option.addClass("custom-select-legend");
            t = ioption.text();
            v = ioption.val();
            option.attr("data-value", v);
            option.text(t);
            options_attrs.forEach(function(i){
                option.attr(i, ioption.attr(i));
            })
            body.append(option);
        });
        body.find(".custom-select-option").mouseenter(function(){$(this).css({"background": default_select_settings["option_hover_background"], "color": default_select_settings["option_hover_color"]});})
        body.find(".custom-select-option").mouseleave(function(){$(this).css({"background": "white", color: "black"});})
        wrapper.append(head);
        wrapper.append(body);
        iselect.after(wrapper);
    });
    $(".custom-select-head-value").each(function(){
        t = $(this).text();
        opt = $(".custom-select-option").filter(function() { return $(this).text() === t});
        toFilterCustomSelects(opt);
    })
}
$.fn.chooseCustomSelectOption = function(arrow_toggle=true){
    /* filter part */
    toFilterCustomSelects(this);
    /* /filter part */
    v = this.attr("data-value");
    t = this.text();
    this.closest(".custom-select-wrapper").prev("select.custom-select").val(v);
    par = this.closest(".custom-select-body");
    head = par.prev(".custom-select-head");
    head.find(".custom-select-head-value").text(t);
    if (arrow_toggle) selectArrowToggle(head.find("i"));
    par.slideUp("fast");
}
$(document).on('click', 'html', function(event){
    if (!$(event.target).closest(".custom-select-wrapper").length) {
        hideVisibleCustomSelect();
    }
});
$(document).on("click", ".custom-select-head", function(){
    already_active = $(this).next(".custom-select-body").is(":visible");
    hideVisibleCustomSelect();
    if (already_active) return false;
    arrow = $(this).find("i");
    // -2 because of 1px border * 2
    parent_w = $(this).closest(".custom-select-wrapper").width() - 2;
    parent_h = $(this).closest(".custom-select-wrapper").height() + 1;
    x = $(this).position().left;
    y = $(this).position().top + parent_h;
    b = $(this).next(".custom-select-body");

    b.css({'top':y,'left':x}).width(parent_w).slideDown("fast", function(){ selectArrowToggle(arrow);});
});
$(document).on("click", ".custom-select-option", function(){
    $(this).chooseCustomSelectOption();
    vision();
});

//====================================================================
/*     SHADOW        */
$.fn.shadowFadeDestroy = function() {
    this.fadeOut(500, function(){ this.remove()});
}

function shadowAlert(str, destroy=true) {
    $(".shadow-message-text").text(str);
    $(".shadow-message").initShadow();
    if (destroy) setTimeout("$('.shadow-wrapper').shadowFadeDestroy()", 2000);
}

$.fn.initShadow = function(settings){
    for (var k in settings) { default_shadow_settings[k] = settings[k] }
    wrapper = $('<div class="shadow-wrapper"></div>');
    shadow = $('<div class="shadow-shadow"></div>');
    body = $('<div class="shadow-body"><i class="material-icons right shadow-close">close</i></div>');
    body.css(default_shadow_settings);
    //content = $(this).contents().clone();
    wrapper.append(shadow);
    //body.append(content);
    body.append($(this));
    wrapper.append(body);
    $("body").prepend(wrapper);
};
$(document).on("click", ".shadow-close", function(){
    $(this).closest(".shadow-wrapper").remove();
});
$(document).on("click", ".shadow-shadow", function(){
    $(this).closest(".shadow-wrapper").remove();
});
/*     /SHADOW        */
//====================================================================