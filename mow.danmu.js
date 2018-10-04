var danmu;
;(function () {
    danmu=function (element,option) { 
        var $el$type=null;
        if(typeof element=='string'){
            this.$el=element.trim();
            $el$type = this.get$el$type(this.$el);
            this.old$el=this.$el;
            this.old$el$type=$el$type;
            this.put$el$type($el$type);
            this.defualtOption();
            this._initDanmu();
            var plx = this.$el.clientHeight / 100;
            if (Math.floor(plx) < 1) {
                plx = 1;
            } else {
                plx = Math.floor(plx);
            }
            this._danmuMake=new dmMake({px:plx,ctx:this.ctx},this);
        }else{
            throw new Error('需要给出指定元素');
        }
    }
    danmu.prototype={
        defualtOption:function(){
            this.option={
                $el:this.$el,
                width:this.$el.clientWidth,
                height:this.$el.clientHeight,
                // background:'#fff'
            }
            return this.option;
        },
        reset:function () {
            this.$el.innerText='';
            return new danmu(this.old$el,this.option);
        },
        clearCanvas:function () {  
            this.canvas.width = this.$el.clientWidth;
            this.canvas.height = this.$el.clientHeight;
        },
        _initDanmu:function(){
            $el=this.$el;
            $el.style.width = this.option.width+'px';
            $el.style.height = this.option.height + 'px';
            $el.style.background = this.option.background;
            // $el.style.margin='0';
            $el.style.padding='0';
            var cvs = this._makeCanvas();
            this.canvas=cvs;
            this.$el.append(cvs);
        },
        _makeCanvas:function () {
            var cvs=document.createElement('canvas');
            cvs.innerText='你的浏览器不支持canvas';
            cvs.id='__my__cvs__';
            cvs.width=this.$el.clientWidth;
            cvs.height=this.$el.clientHeight;
            cvs.style.background=$el.style.background;
            this.option.canvas=cvs;
            this.ctx=cvs.getContext('2d');
            return cvs;
        },
        get$el$type:function () { 
            var $el = null;
            if(arguments.length>0){
                $el=arguments[0].trim();
            }else{
                $el=this.$el;
            }
            if ($el[0] == '.') {
                return 'class';
            } else if ($el[0] == '#') {
                return 'id';
            } else {
                return 'node';
            }
            return false;
        },
        put$el$type:function () { 
            $el$type=null;
            if(arguments.length>0){
                $el$type=arguments[0];
            }else{
                console.warn('...');
                return false;
            }
            switch($el$type){
                case 'class':
                    this.$el = document.getElementsByClassName(this.$el.substr(1))[0];
                    break;
                case 'id':
                    this.$el = document.getElementById(this.$el.substr(1));
                    break;
                case 'node':
                    this.$el = document.getElementsByTagName(this.$el)[0];
                    break;
            }
        },
        addDanmu:function (dm) {
            return this._danmuMake.addDanmu(dm);
        },
        toString:function () { 
            return this.$el;
        }
    }
    var dmMake=function (option,per) { 
        if(typeof option=='object'){
            this.px = option.px;
            this.ctx=option.ctx;
            this._danList=[];
            this.per=per;
            // this.MAXLEN=40;
            // this.danVal=0;
            // this.bufferDan=[];
        }else{
            throw new Error('弹幕格式不对');
        }
        _self=this;
        this.timer=setInterval(function (e) {
            _self.per.clearCanvas();
            for (var i in _self._danList){
                var d = _self._danList[i];
                --d.startpoint;
                //console.log(d.text,d.startpoint);
                if(d.startpoint<-d.textWidth){
                    _self._danList.splice(i,1);
                    //console.log(_self._danList);
                    //console.log('end dm');
                }
                d.update();
            }
        },10);
    }
    dmMake.prototype={
        addDanmu:function (dm,per) {
            var per=per||this.per; 
            var d = new dan(dm, this);
            d.index = this._danList.length;
            this._danList.push(d);
            return d;
        }
    }
    var dan=function (option,per) { 
        this.size=option.size||2;
        this.text=option.text||'null danmu';
        this.line=option.line||'top';
        this.per=per;
        this._gradper=per.per;
        this.index=-1;
        this.startpoint = this._gradper.$el.clientWidth;
        this.start();
    }
    dan.prototype={
        start:function () {
            var cube = Math.floor(this._gradper.$el.clientHeight/3);
            var line = Math.floor(cube / 2);
            switch(this.line){
                case 'top':
                    line = Math.floor(cube / 2);
                    break;
                case 'middle':
                    line = Math.floor(cube / 2)+cube;
                    break;
                case 'bottom':
                    line = Math.floor(cube / 2)+cube*2;
                    break;
                default:
                    line = Math.floor(cube / 2);
                    break;
            }
            this.hline=line;
        },
        update:function () {
            var ctx = this._gradper.ctx;
            ctx.fillStyle = '#fff';
            ctx.strokeStyle='#000';
            ctx.lineWidth=2;
            ctx.font="bold "+this.size*this.per.px+"px 微软雅黑";
            ctx.strokeText(this.text, this.startpoint, this.hline);
            ctx.fillText(this.text, this.startpoint, this.hline);
            this.textWidth = ctx.measureText(this.text).width;
        }
    }
 })();