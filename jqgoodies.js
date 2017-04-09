default_select_settings = {
    "arrow_color": "black",
    "option_hover_color": "black", 
    "option_hover_background": "#e5e5e5"
}
default_shadow_settings = {
    "max_width": "700px",
    "type": "window"
}
default_calendar_settings = {
    "time": false,
    "onMonthUpdate": false,
    "onCalendarInit": false,
    "onDayClick": false
}
function mergeSettings(default_settings, user_settings) {
    default_clone = Object.assign({}, default_settings);
    return Object.assign(default_clone,user_settings)
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
$.fn.initCustomSelect = function(user_settings){
    settings = mergeSettings(default_select_settings,user_settings)
    filter_attrs = ["data-filter", "data-filter-role", "data-filter-relation-id"];
    options_attrs = ["data-children", "data-parent"];
    this.each(function(i){
        iselect = $(this);
        iselect.hide();
        init_val = iselect.children("option:selected").text();
        wrapper = $('<div class="custom-select-wrapper"></div>');
        head = $('<div class="custom-select-head"><span class="custom-select-head-value"></span><i class="material-icons select-arrow">arrow_drop_down</i></div>');
        head.find(".custom-select-head-value").text(init_val);
        head.addClass("valign-wrapper");
        head.find(".custom-select-head-value").addClass("valign");
        head.find(".select-arrow").addClass("valign").css({"color": settings["arrow_color"]});
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
        body.find(".custom-select-option").mouseenter(function(){$(this).css({"background": settings["option_hover_background"], "color": settings["option_hover_color"]});})
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
    this.fadeOut(1500, function(){ this.remove()});
}
function shadowClose() {
    $(".shadow-wrapper").remove();
}
$(document).on("click", ".testok", function(){
    $(this).closest(".shadow-alert").attr("data-answer", $(this).text())
})

function shadowAlert(str, destroy) {
    shadow_msg = $("<div class='shadow-alert'></div>");
    shadow_msg.text(str);
    shadow_msg.initShadow({"type": "alert"});
    if (destroy) setTimeout("$('.shadow-wrapper').shadowFadeDestroy()", 2000);
    return false;
}

$.fn.initShadow = function(user_settings, callback){
    settings = mergeSettings(default_shadow_settings,user_settings)
    wrapper = $('<div class="shadow-wrapper"></div>');
    shadow = $('<div class="shadow-shadow"></div>');
    close = $('<div class="right-align"><i class="material-icons shadow-close">close</i></div>');
    body = $('<div class="shadow-body"></div>');
    if (settings.type != "alert") body.append(close);
    body.css({"max-width": settings.max_width});
    wrapper.append(shadow);
    body.append($(this));
    wrapper.append(body);
    $("body").prepend(wrapper);
    if (callback) callback()
};
$(document).on("click", ".shadow-close", function(){
    shadowClose();
});
$(document).on("click", ".shadow-shadow", function(){
    shadowClose();
});
/*     /SHADOW        */
//====================================================================
//====================================================================
/*     CALENDAR        */
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function getJQMonth(y,m) {
    first_day = new Date(y,m, 1);
    last_day = new Date(y,m+1, 0);
    first_day_of_week = first_day.getDay() || 7;
    last_day_of_week = last_day.getDay() || 7;
    weeks = {}
    m = parseInt(m)+1;
    for (var i=0; i<6; i++) {
        tmp = []
        for (var j=1; j<8; j++) {
            text = i*7+j-first_day_of_week+1;
            if (i == 0 && j < first_day_of_week) text="";
            if (i == 5 && j > last_day_of_week) text="";
            if (text > last_day.getDate()) text="";
            weeks[i + "-" + j] = text;
        }
    }
    return weeks;
}
$.fn.nextMonth = function(delta) {
    // delta -1 or +1
    DateControl = this.closest(".custom-calendar-date-control");
    cur_year = parseInt(DateControl.find(".custom-calendar-control-year").attr("data-cur-year"));
    cur_month = parseInt(DateControl.find(".custom-calendar-control-month").attr("data-cur-month"));
    next_year = cur_year;
    next_month = cur_month + delta;
    if (next_month == -1 || next_month == 12) next_year = cur_year + delta;
    if (next_month == 12) next_month = 0;
    if (next_month == -1) next_month = 11;
    newdate = new Date(next_year, next_month, 1);
    this.closest(".custom-calendar").updateCalendar(next_year, next_month);
}
$.fn.updateCalendar = function(y,m,d) {
    this.find(".custom-calendar-day").removeClass("empty").removeClass("today").removeClass("green-back");
    weeks = getJQMonth(y,m);
    today = this.attr("data-today");
    this.find(".custom-calendar-control-year").attr("data-cur-year", y).text(y);
    this.find(".custom-calendar-control-month").attr("data-cur-month", m).text(monthNames[m]);
    this.find(".custom-calendar-day").removeClass("empty");
    this.find(".custom-calendar-day").each(function(){
        coords = $(this).attr("coords");
        v = weeks[coords]
        $(this).text(v);
        $(this).attr("data-day", [y,m+1,v].join("-"));
        if (v=="") $(this).addClass("empty");
    });
    this.find(".custom-calendar-month").find(".custom-calendar-day[data-day='" + today + "']").addClass("today");
    this.trigger("MonthUpdate");
}
$.fn.initCalendar = function(user_settings) {
    settings = mergeSettings(default_calendar_settings,user_settings)
    this.append($('<div class="custom-calendar"></div>'));
    var Calendar = this.find(".custom-calendar");
    today = new Date();
    y = today.getFullYear();
    m = today.getMonth();
    d = today.getDate();
    current_date = $('<div class="custom-calendar-current-date">\
                        <div>Today:</div>\
                        <div class="custom-calendar-current-day"></div>\
                        <div class="custom-calendar-current-month"></div>\
                        <div class="custom-calendar-current-year"></div>\
                    </div>');
    date_control = $('<div class="row custom-calendar-date-control">\
                        <div class="custom-calendar-date-control-inner col s12 m6">\
                            <i class="material-icons purple-icon custom-calendar-prev left" onclick="$(this).nextMonth(-1)">chevron_left</i>\
                            <span class="custom-calendar-control-month"></span>\
                            <span class="custom-calendar-control-year"></span>\
                            <i class="material-icons purple-icon custom-calendar-next right" onclick="$(this).nextMonth(1)">chevron_right</i>\
                        </div>\
                    </div>');
    time = $("<div class='custom-timepicker col s12 m6 right-align'></div>");
    month_head = $('<div class="custom-calendar-week">\
                        <div class="custom-calendar-day-head">Mon</div>\
                        <div class="custom-calendar-day-head">Tue</div>\
                        <div class="custom-calendar-day-head">Wed</div>\
                        <div class="custom-calendar-day-head">Thu</div>\
                        <div class="custom-calendar-day-head">Fri</div>\
                        <div class="custom-calendar-day-head">Sat</div>\
                        <div class="custom-calendar-day-head">Sun</div>\
                    </div>');
    current_month = $('<div class="custom-calendar-month"></div>');
    for (var i=0; i<6; i++) {
        week = $("<div class='custom-calendar-week'></div>");
        for (var j=1; j<8; j++) {
            day = $("<div class='custom-calendar-day'></div>");
            day.attr("coords", i + "-" + j);
            week.append(day);
        }
        current_month.append(week)
    }

    current_date.find(".custom-calendar-current-year").text(y);
    current_date.find(".custom-calendar-current-month").text(monthNames[m]);
    current_date.find(".custom-calendar-current-day").text(d);
    if (settings['time']) {
        time.initCustomTimepicker();
        date_control.append(time);
    }
    Calendar.append(current_date);
    Calendar.append(date_control);
    Calendar.append(month_head);
    Calendar.append(current_month);
    Calendar.attr("data-today", y + "-" + (m+1) + "-" + d);
    Calendar.updateCalendar(y,m);
    Calendar.bind("MonthUpdate", settings.onMonthUpdate);
    Calendar.bind("CalendarInit", settings.onCalendarInit);
    Calendar.find(".custom-calendar-day").on("click", settings.onDayClick);
    Calendar.trigger("CalendarInit");
    Calendar.trigger("MonthUpdate");
}
/*     /CALENDAR        */
//====================================================================

//====================================================================
/*     /TIMEPICKER        */
function digitAutoComplete(s){
    if (s.length == 1) return "0" + s;
    else return s;
}

$.fn.initCustomTimepicker = function(){
    ranges = [24,60,60];
    names = ["hours", "minutes", "seconds"];
    body = $('<div class="custom-timepicker-body"></div>');
    hours = $('<div class="custom-timepicker-item custom-hours">');
    minutes = $('<div class="custom-timepicker-item custom-minutes">');
    seconds = $('<div class="custom-timepicker-item custom-seconds">');
    [hours,minutes,seconds].forEach(function(item,i){
        s = $("<select></select>");
        s.attr("name", names[i]);
        for(j=0;j<ranges[i];j++){
            j_text = digitAutoComplete(j.toString());
            o = $("<option></option");
            o.text(j_text);
            o.attr("value", j);
            s.append(o);
        }
        item.append(s);
    })
    body.append(hours);
    body.append(minutes);
    body.append(seconds);
    this.append(body);
}
$.fn.getCustomTimepickerValue = function(){
    h = this.find(".custom-hours select").val();
    m = this.find(".custom-minutes select").val();
    s = this.find(".custom-seconds select").val();
    return [digitAutoComplete(h),digitAutoComplete(m),digitAutoComplete(s)].join(":");
}
/*     /TIMEPICKER        */
//====================================================================