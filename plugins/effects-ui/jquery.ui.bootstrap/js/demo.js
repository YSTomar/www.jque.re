$(function(){$("#accordion").accordion({header:"h3"});$("#tabs2, #tabs").tabs();$("button").button();$(".button,#sampleButton").button();$("#radioset").buttonset();$("#format").buttonset();$("#dialog").dialog({autoOpen:false,width:600,buttons:{Ok:function(){$(this).dialog("close")},Cancel:function(){$(this).dialog("close")}}});$("#dialog_link").click(function(){$("#dialog").dialog("open");return false});$("#modal_link").click(function(){$("#dialog-message").dialog("open");return false});$("#datepicker").datepicker({inline:true});$("#slider").slider({range:true,values:[17,67]});$("#progressbar").progressbar({value:20});$("#dialog_link, #modal_link, ul#icons li").hover(function(){$(this).addClass("ui-state-hover")},function(){$(this).removeClass("ui-state-hover")});var availableTags=["ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"];$("#tags").autocomplete({source:availableTags});$("#dialog-message").dialog({autoOpen:false,modal:true,buttons:{Ok:function(){$(this).dialog("close")}}});$(".ui-dialog :button").blur();$("#slider-vertical").slider({orientation:"vertical",range:"min",min:0,max:100,value:60,slide:function(event,ui){$("#amount").val(ui.value)}});$("#amount").val($("#slider-vertical").slider("value"));$("#rerun").button().click(function(){alert("Running the last action")}).next().button({text:false,icons:{primary:"ui-icon-triangle-1-s"}}).click(function(){alert("Could display a menu to select an action")}).parent().buttonset();var $tab_title_input=$("#tab_title"),$tab_content_input=$("#tab_content");var tab_counter=2;var $tabs=$("#tabs2").tabs({tabTemplate:"<li><a href='#{href}'>#{label}</a></li>",add:function(event,ui){var tab_content=$tab_content_input.val()||"Tab "+tab_counter+" content.";$(ui.panel).append("<p>"+tab_content+"</p>")}});var $dialog=$("#dialog2").dialog({autoOpen:false,modal:true,buttons:{Add:function(){addTab();$(this).dialog("close")},Cancel:function(){$(this).dialog("close")}},open:function(){$tab_title_input.focus()},close:function(){$form[0].reset()}});var $form=$("form",$dialog).submit(function(){addTab();$dialog.dialog("close");return false});function addTab(){var tab_title=$tab_title_input.val()||"Tab "+tab_counter;$tabs.tabs("add","#tabs-"+tab_counter,tab_title);tab_counter++}$("#add_tab").button().click(function(){$dialog.dialog("open")});$("#tabs span.ui-icon-close").live("click",function(){var index=$("li",$tabs).index($(this).parent());$tabs.tabs("remove",index)});$("#rangeA").daterangepicker();$("#rangeBa, #rangeBb").daterangepicker();var $tab_title_input=$("#tab_title"),$tab_content_input=$("#tab_content");var tab_counter=2;var $tabs=$("#tabs2").tabs({tabTemplate:"<li><a href='#{href}'>#{label}</a></li>",add:function(event,ui){var tab_content=$tab_content_input.val()||"Tab "+tab_counter+" content.";$(ui.panel).append("<p>"+tab_content+"</p>")}});var $dialog=$("#dialog2").dialog({autoOpen:false,modal:true,buttons:{Add:function(){addTab();$(this).dialog("close")},Cancel:function(){$(this).dialog("close")}},open:function(){$tab_title_input.focus()},close:function(){$form[0].reset()}});var $form=$("form",$dialog).submit(function(){addTab();$dialog.dialog("close");return false});function addTab(){var tab_title=$tab_title_input.val()||"Tab "+tab_counter;$tabs.tabs("add","#tabs-"+tab_counter,tab_title);tab_counter++}$("#add_tab").button().click(function(){$dialog.dialog("open")});$("#tabs span.ui-icon-close").live("click",function(){var index=$("li",$tabs).index($(this).parent());$tabs.tabs("remove",index)});$("#file").customFileInput({button_position:"right"});$("#menu1").wijmenu({trigger:".wijmo-wijmenu-item",triggerEvent:"click"});$("#play, #shuffle").button();$("#repeat").buttonset()});