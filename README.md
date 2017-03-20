# About jqGoodies
Some JQ functions with styles for web routine.

# Ready to use
- Pretty select
- Shadow alert (or anything else)
# Examples
## - Select
#### Simple select

Just add "custom-select" class to your "select" tag
```html
<select class="custom-select">
    <option>1</option>
    <option>2</option>
</select>
```
And init custom select
```javascript
    $(document).ready(function(){
        $(".custom-select").initCustomSelect(settings)
    })
```
Available settings:
- arrow_color
- option_hover_color
- option_hover_background

Example of settings:
example of settings:
```
default_select_settings = {
    "arrow_color": "black",
    "option_hover_color": "black", 
    "option_hover_background": "#e5e5e5"
}
```
### Filtering select options by other select
```html
<select class="custom-select" data-filter="true" data-filter-role="donor" data-filter-relation-id = "1">
    <option value="v1" data-children="1">v1</option>
    <option value="v2" data-children="2">v2</option>
    <option value="v3" data-children="3">v3</option>
</select>
<select class="custom-select" data-filter="true" data-filter-role="object" data-filter-relation-id = "1">
    <option value="v11" data-parent="1">v11</option>
    <option value="v22" data-parent="2">v22</option>
    <option value="v33" data-parent="3">v33</option>
</select>
```
**data-filter** turns *filter* mode on;
**data-filter-role** defines object role (*donor* or *object*);
**data-filter-relation-id** links *donor* with *object*;
**data-children** *donor* option links with **data-parent** *object* options.
## - Shadow
### Shadow alert  
Shadow alert is very simple to use:
```javascript
   shadowAlert("your shadow message", true);
```
shadowAlert function takes two parameters:
- message text
- distroy flag (true or false) - is it necessary to destroy alert object after 2 seconds, or user should do this himself.
### Shadow anything
You can use shadow with any object you like. Just init the shadow:
```javascript
    $(document).ready(function(){
        $(".your-shadow-div").initShadow(settings)
    })
```
where *settings* id dict with following params:
- max_width - for css style (default 700px)
- type - type of shadow object:
-- window (with *close* icon )
-- alert (with no *close* icon )

example of settings:
```
default_shadow_settings = {
    "max_width": "700px",
    "type": "window"
}
```
