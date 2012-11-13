var Touch={};(function(g,b){var i={},j="ontouchstart" in window,e=j?"touchstart":"mousedown",d=j?"touchmove":"mousemove",h=j?"touchend":"mouseup",a=j?"touchcancel":"mouseup",f="px",l="#",c=Function.prototype,k=Array.prototype.slice;if(!c.bind){c.bind=function(o){if(arguments.length<2&&arguments[0]===b){return this}var m=this,n=k.call(arguments,1);return function(){var p=n.concat(k.call(arguments,0));return m.apply(o,p)}}}$.isEmpty=function(n,m){return n===null||n===b||(($.isArray(n)&&!n.length))||(!m?n==="":false)};g.get=function(m){return i[m]};g.Masker=function(){var m={};return{mask:function(u,v){var u=$(u),z=u.width(),y=u.height(),A=v?"<span>"+v+"</span>":"",t=m[u.selector],s;if(t){s=t.children("span");if(v){if(!s||!s.length){s=$(A).appendTo(t)}else{s.html(v)}}else{if(s){s.remove()}}}else{var n=!u.parent("body").length,r=n?u:u.parent(),x=u.offset(),q={"z-index":u.css("z-index")=="auto"?0:u.css("z-index")+1},o=['<div class="touch-mask"  style="position: absolute;opacity:0;-webkit-transform:translate3d(0,0,0)"><div unselectable="on" style="-webkit-transform:translate3d(0,0,0)"></div>'];if(v){o.push(A)}o.push("</div>");$.extend(q,n?{top:0,bottom:0,left:0,right:0}:{top:x.top+f,left:x.left+f,width:z+f,height:y+f});t=$(o.join("")).appendTo(r).css(q);s=t.children("span");m[u.selector]=t}s.css({left:(z-s.width())/2+f,top:t.height()*2/3-11+f});t.animate({opacity:1},500,"ease-out")},unmask:function(n){var n=$(n),o=m[n.selector];if(o){o.animate({opacity:0},500,"ease-in",function(){o.remove();m[n.selector]=null;delete m[n.selector]})}}}}();g.Ajax=function(m){i[m.id]=this;delete m.id;this.data=null;this.options={type:"POST",dataType:"json",timeout:g.Ajax.timeout,parameters:{}};$.extend(this.options,m)};g.Ajax.timeout=0;$.extend(g.Ajax.prototype,{setData:function(o,p){this.data=o;if(p){for(var m=0,n=o.length;m<n;m++){o[m]["_status"]=p}}return this},addParameter:function(m,n){if($.isObject(m)){for(var o in m){this.addParameter(o,m[o])}}else{this.options.parameters[m]={value:n}}return this},removeParameter:function(m){delete this.options.parameters[m];return this},setUrl:function(m){this.options.url=m;return this},request:function(o,r,w){var n={},m=this.options.parameters;if(o){this.options.success=o.bind(w||window)}if(r){this.options.error=r.bind(w||window)}for(var t in m){var u=m[t],q=u.bind,s=u.datatype;n[t]=q?$(l+q).val():u.value;switch(u.datatype){case"int":case"float":case"java.lang.Long":n[t]=Number(n[t]);break;case"boolean":n[t]=n[t]=="true"}}n=this.data?$.extend({parameter:this.data},n):{parameter:n};this.options.data={_request_data:JSON.stringify(n)};this.xhr=$.ajax(this.options);return this}});g.DateField=function(n){this.canPage=true;this.viewSize=6;i[n.id]=this;$.extend(this,n);var m=new Date(),o=n.year||m.getFullYear(),p=n.month||m.getMonth()+1;this.defaultDate=new Date(o,p-1);this.wrap=$(l+n.id);this.initComponent();this.processListener("on");this.buildViews();this.onClick=function(r){var q=$(r.target),s=q.attr("_date")||((q=q.parents("[_date]")).length&&q.attr("_date"));if(s){this.wrap.trigger("itemclick",[new Date(Number(s)),q[0]])}}.bind(this)};$.extend(g.DateField.prototype,{initComponent:function(){this.head=this.wrap.children(".datefield-head");this.content=this.wrap.children(".datefield-scroller").width(this.wrap.width()*6);this.title=this.head.children(".datefield-date").children("div");this.preBtn=this.head.children("button.pre");this.nextBtn=this.head.children("button.next");var n=this,m=false,p=false,o;this.iscroll=new iScroll(this.id,{snap:true,momentum:false,hScrollbar:false,onScrollStart:function(){n.wrap.trigger("scrollstart")},onBeforeScrollStart:function(q){p=true},onBeforeScrollEnd:function(q){if(this.moved){m=true;this._unbind(e)}else{if(p){n.onClick(q)}}p=false},onScrollEnd:function(){if(m){this._bind(e);m=false}n.reViews();n.reflashHead()}})},processListener:function(m){if(this.listeners){this.wrap[m](this.listeners)}$(window).on("resize",this.resize.bind(this))},resize:function(){var o=this.wrap.width(),m=this.views,p=this;this.content.width(this.viewSize*o);for(var n in m){m[n].el.width(o)}setTimeout(function(){p.iscroll.scrollToPage(p.iscroll.currPageX,null,0)},10)},reViews:function(){var t=this.iscroll,m=t.currPageX,p=this.date=new Date(this.months[m]),s=p.getMonth()+1,r=p.getFullYear(),n=this.views,q=new Date(r,s-3);if(!n[q]){n[q]=new g.DateField.View(q,this,true);n[new Date(r,s+this.viewSize-3)].destroy();t.scrollToPage(m+1,null,0)}else{var o=new Date(r,s+1);if(!n[o]){n[o]=new g.DateField.View(o,this);n[new Date(r,s-this.viewSize+1)].destroy();t.scrollToPage(m-1,null,0)}}},clearViews:function(){if(this.views){for(var m in this.views){this.views[m].destroy()}}this.views={};this.months=[]},buildViews:function(s){this.clearViews();s=s||this.defaultDate;for(var q=s.getMonth(),r=this.viewSize/2,o=q-r,n=q+r;o<n;o++){var p=new Date(s.getFullYear(),o);this.views[p]=new g.DateField.View(p,this)}this.goToDate(s)},reflashHead:function(){this.wrap.trigger("refresh",this.date)},preMonth:function(){this.goToDate(new Date(this.date.getFullYear(),this.date.getMonth()-1),500)},nextMonth:function(){this.goToDate(new Date(this.date.getFullYear(),this.date.getMonth()+1),500)},goToDate:function(m,n){if(!this.canPage){return}m=new Date(m.getFullYear(),m.getMonth());if(m.getTime()==(this.date&&this.date.getTime())){return}if(this.views[m]){this.iscroll.scrollToPage(this.months.indexOf(m.getTime()),null,n||0)}else{this.buildViews(m)}},getCurrentViewDatas:function(){return this.views[this.date].data},redraw:function(n){var m=this.views[this.date];m.data=n;m.isAjax=!!n;m.draw()},setCanPage:function(m){var n=this;this.canPage=m;this.iscroll[m?"_bind":"_unbind"](e);this.wrap[m?"unbind":"bind"](h,this.onClick)},isAjax:function(n){var m=this.views[n];return !!m&&m.isAjax}});g.DateField.View=function(n,m,o){m.months[o?"unshift":"push"](n.getTime());this.date=n;this.options=m;this.el=$(this.tpl.join("")).width(m.wrap.width())[o?"prependTo":"appendTo"](m.content);this.body=this.el.children("tbody");this.draw()};$.extend(g.DateField.View.prototype,{tpl:['<table class="datefield-view" cellspacing="0" cellpadding="0"><thead><tr height="20',f,'"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody></tbody></table>'],offset:function(){return this.el[0].offsetLeft},draw:function(){var r=[],o=this.date,y=o.getFullYear(),v=o.getMonth()+1,u=this.options;for(var q=1,n=new Date(y,v-1,1).getDay(),z=new Date(y,v-1,0).getDate();q<=n;q++){r.push(null)}for(var q=1,B=new Date(y,v,0).getDate();q<=B;q++){r.push(new Date(y,v-1,q))}for(var q=1,B=new Date(y,v,0).getDay(),s=43-r.length;q<s;q++){r.push(null)}this.body.text("");var p=0;while(r.length){var C=$(this.body[0].insertRow(-1));C.attr({r_index:p,vAlign:this.options.valign});if(this.options.valign){C.attr({vAlign:this.options.valign})}p++;for(var q=1;q<=7;q++){var x=r.shift();if(x!==b){var A=$(C[0].insertCell(-1));if(x){A.attr({c_index:q-1});var t=x.getDay(),m=x.getDate(),w=u.dayrenderer;if(t==0||t==6){m='<span style="color:red">'+m+"</span>"}A.html(w&&w.call(u,A,x,m,this.data)||m);A.attr({_date:(""+x.getTime())})}else{A.html("&#160;")}}}}},destroy:function(){this.el.remove();this.options.months.splice(this.options.months.indexOf(this.date.getTime()),1);delete this.options.views[this.date]}});g.SwitchButton=function(m){i[m.id]=this;this.options={on:"开",off:"关",onvalue:"Y",offvalue:"N",defaultstatus:"off"};var n=this.options;$.extend(n,m);this.wrap=$(l+m.id);n.defaultvalue=n.defaultstatus=="off"?n.offvalue:n.onvalue;this.initComponent();this.val(m.value||n.defaultvalue);this.processListener()};$.extend(g.SwitchButton.prototype,{initComponent:function(){this.btn=this.wrap.children(".switch-btn");this.rightside=this.wrap.width()-this.btn.width()-2},processListener:function(){var p={},n=function(q){p.x=(j?q.touches[0]:q).pageX;p.startX=this.x;$(document).on(d,o);$(document).on(h,m)}.bind(this),o=function(t){p.moved=true;var q=(j?t.touches[0]:t).pageX,u=this.x+q-p.x,s=this.rightside;if(u<0){u=0}else{if(u>s){u=s}else{p.x=q}}this._pos(u)}.bind(this),m=function(q){$(document).off(d,o);$(document).off(h,m);if(this.x!=p.startX||!p.moved){this.trigger()}p={}}.bind(this);this.wrap.on(e,n)},_pos:function(m,n){this.x=$.isEmpty(m)?this.x||0:m;this.btn.animate({translate3d:[this.x+f,0,0].join(",")},n||0)},on:function(){this.val(this.options.onvalue,100)},off:function(){this.val(this.options.offvalue,100)},trigger:function(){this[this.wrap.val()==this.options.onvalue?"off":"on"]()},val:function(m,p){if(m===b){return this.wrap.val()}var o=this.wrap,n=o.val();if(n!=m){o.val(m).trigger("change",[m,n]);this._pos(m==this.options.onvalue?this.rightside:0,p)}}});g.List=function(n){var m=n.bind,q=this.id=n.id,o=i[q]=this;this.wrap=$("#"+q);this.renderer=n.renderer;this.total=0;this.pageSize=n.size||10;this.currentPage=1;this.selected=[];this.selectable=n.selectable||false;var p=g.get(m);this.ajax=p;$(document).on("ajaxSuccess",function(y,z,A){if(z==p.xhr){var t=JSON.parse(z.responseText);if(t&&t.success){o.total=t.result.totalCount||0;o.totalPage=Math.ceil(o.total/o.pageSize)||0;if(t.result.totalCount>0){var v=["<ul>"],s=o.data=[].concat(t.result.record),r=window[o.renderer];for(var u=0;u<s.length;u++){var w=s[u];v[v.length]='<li dataindex="'+u+'">';if(r){v[v.length]=r(w)}else{v[v.length]=w}v[v.length]="</li>"}v[v.length]="</ul>";if(n.showpagebar){var x=['<table width="100%" border="0" cellspacing="3">',"<tr>",'<td width="40%">','<button type="button" id="'+q+'_pre" class="btn gray" style="float:right;font-size:16px;height:30px;">上一页</button>',"</td>",'<td width="20%" id="'+q+'_info" style="text-align:center;font-size:16px;">'+o.currentPage+"/"+o.totalPage+"</td>",'<td width="40%">','<button type="button" id="'+q+'_next" class="btn gray" style="float:right;font-size:16px;height:30px;">下一页</button>',"</td>","</tr>","</table>"];v[v.length]=x.join("")}o.wrap.html(v.join(""));$("#"+q+"_pre").on("click",function(){Touch.get(q).pre()});$("#"+q+"_next").on("click",function(){Touch.get(q).next()});o.processSelectEvent()}else{o.wrap.html("未找到任何数据!")}if(n.callback){window[n.callback]()}}}});this.url=this.ajax.options.url;this.prefix=this.url.indexOf("?")==-1?"?":"&";this.ajax.options.url=this.url+this.prefix+"pagenum="+this.currentPage+"&pagesize="+this.pageSize;if(n.autoquery==true){this.ajax.request()}};$.extend(g.List.prototype,{processSelectEvent:function(){var p=this,o=false,n=function(r){$(document).on(d,q);$(document).on(h,m)},q=function(r){o=true},m=function(r){$(document).off(d,q);$(document).off(h,m);if(!o){p.onClick(r)}o=false};p.wrap.on(e,n)},onClick:function(p,n){var m=$(p.target).parents("li[dataindex]");if(m){var o=this.data[m.attr("dataindex")];if(this.selected.indexOf(o)!=-1){this.unselect(o,m)}else{this.select(o,m)}}},selectAll:function(){if(!this.selectable){return}this.selected=[].concat(this.data);this.wrap.find("li").addClass("selected")},unSelectAll:function(){if(!this.selectable){return}this.selected=[];this.wrap.find("li").removeClass("selected")},select:function(n,m){if(!this.selectable){return}this.selected.push(n);m.addClass("selected")},unselect:function(n,m){if(!this.selectable){return}this.selected.splice(this.selected.indexOf(n),1);m.removeClass("selected")},getSelected:function(){return this.selected},loading:function(){$("#"+this.id).html("正在查询...")},query:function(){this.loading();this.currentPage=1;this.ajax.options.url=this.url+this.prefix+"pagenum="+this.currentPage+"&pagesize="+this.pageSize;this.ajax.request()},pre:function(){this.loading();if(this.currentPage-1<=0){return}this.currentPage--;this.ajax.options.url=this.url+this.prefix+"pagenum="+this.currentPage+"&pagesize="+this.pageSize;this.ajax.request()},next:function(){this.loading();if(this.currentPage+1>this.totalPage){return}this.currentPage++;this.ajax.options.url=this.url+this.prefix+"pagenum="+this.currentPage+"&pagesize="+this.pageSize;this.ajax.request()}});Date.prototype.format=function(n){var p={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};if(/(y+)/.test(n)){n=n.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))}for(var m in p){if(new RegExp("("+m+")").test(n)){n=n.replace(RegExp.$1,RegExp.$1.length==1?p[m]:("00"+p[m]).substr((""+p[m]).length))}}return n}})(Touch);