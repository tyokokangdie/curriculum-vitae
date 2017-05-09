/**
 * Created by huhan on 2017/1/25.
 */
window.onload = function () {
    load();
    ech();
}
function load() {
    setTimeout(function () {
        document.querySelector('.loading').style.display = 'none';
        //调用屏幕上下滑动封装
        swipe(document.getElementsByClassName('swipe')[0]);
        //调用音频控制
        player();
    }, 1);
}
//屏幕上下滑动封装，需要传入大盒子元素
function swipe(element) {
    //用对象封装起来，先写构造函数，需要传入大盒子
    function SwipeDom(parentElement) {
        //因为事件里要用到当前对象this，声明that指向this，在事件函数里用that
        var that = this;
        //获取大盒子
        this.parentDom = parentElement;
        //大盒子位置
        this.parentY = 0;
        this.parentDom.style.top = this.parentY + 'px';
        //标记当前页面的索引
        this.index = 0;
        //获取所有的页面
        this.doms = parentElement.children;
        //浏览窗口的高度,就是一个页面的高度
        this.height = document.body.offsetHeight;
        //设置每个页面的位置和高度,添加上监听滑动结束的事件
        for (var i = 0; i < this.doms.length; i++) {
            this.doms[i].style.height = this.height + 'px';
            this.doms[i].style.top = i * this.height + 'px';
            //滑动用到过渡属性,监听过渡结束事件
            this.doms[i].addEventListener('webkitTransitionEnd', function (e) {
                if (that.flag == 2 && e.target == that.doms[that.index]) {
                    //判断流程是否到这一步并且事件源是当前页面
                    //更改流程进度
                    that.flag = 0;
                    //过渡属性是用在滑动结束后被遮住的页面,让被遮住的页面取掉active类名,动画恢复原位
                    this.className = '';
                    //让当前索引等于目标索引
                    that.index = that.targetIndex;
                }
            });
        }
        //触摸滑动用到的变量
        this.startY = 0;
        this.distanceY = 0;
        this.isMove = false;
        //滑动流程控制,0:动画结束,初始状态,1:触摸开始,还没结束,2:触摸结束,动画没有结束,
        this.flag = 0;
        //大盒子添加触摸开始事件
        this.parentDom.addEventListener('touchstart', function (e) {
            if (that.flag == 0) {
                //判断流程是否到这一步,并且更改流程进度
                that.flag = 1;
                //移除浏览器默认行为
                e.preventDefault();
                //记录触摸初始位置
                that.startY = e.touches[0].clientY;
                //去除大盒子过渡属性
                that.parentDom.style.transition = '';
                //设置每个页面的层级为2，比当前页面层级高，位置重置为原来的位置，去除过渡属性
                for (var i = 0; i < that.doms.length; i++) {
                    that.doms[i].style.zIndex = 2;
                    that.doms[i].style.top = i * that.height + 'px';
                    that.doms[i].style.transition = '';
                }
                //当前页面层级设置为1
                that.doms[that.index].style.zIndex = 1;
            }
        });
        //添加触摸滑动事件
        this.parentDom.addEventListener('touchmove', function (e) {
            if (that.flag == 1) {
                //判断流程是否到这一步
                //移除浏览器默认行为
                e.preventDefault();
                //标记发生滑动
                that.isMove = true;
                //记录滑动距离
                that.distanceY = e.touches[0].clientY - that.startY;
                //根据滑动距离给大盒子设置定位位置
                that.parentDom.style.top = (-that.index * that.height + that.distanceY) + 'px';
                //单独设置当前页面的定位位置，让他看起来静止不动
                that.doms[that.index].style.top = (that.index * that.height - that.distanceY) + 'px';
            }
        });
        //添加触摸结束事件
        this.parentDom.addEventListener('touchend', function () {
            //判断发生滑动并且流程到这一步
            if (that.isMove && that.flag == 1) {
                //更改流程进度
                that.flag = 2;
                //根据滑动方向和索引范围计算目标索引值
                that.targetIndex = that.distanceY > 0 ? that.index - 1 : that.index + 1;
                // that.targetIndex = that.targetIndex > that.doms.length - 1 ? that.doms.length - 1 : that.targetIndex < 0 ? 0 : that.targetIndex;
                if (that.targetIndex >= 0 && that.targetIndex <= that.doms.length - 1) {
                    //判断如果目标索引值在范围内,让页面过渡到目标页面
                    //添加过渡属性
                    that.parentDom.style.transition = 'all .5s';
                    that.doms[that.index].style.transition = 'all .5s';

                } else {
                    //否则不用添加过渡属性,让目标索引等于当前索引并且更改流程进度,
                    that.targetIndex = that.index;
                    that.flag = 0;
                }
                setTimeout(function () {
                    //因为同时设置过渡属性和定位位置，会导致过渡属性不起作用，所以用定时器延时1毫秒设置定位位置
                    //大盒子定位
                    that.parentDom.style.top = -that.targetIndex * that.height + 'px';
                    //当前页面也要设置定位，让他看起来静止不动
                    that.doms[that.index].style.top = that.targetIndex * that.height + 'px';
                    //目标索引标记的是滑动结束后显示的页面,给这个页面添加active类名,启用动画效果
                    that.doms[that.targetIndex].className = 'active';
                    //判断当前页数，添加动画效果
                    if (that.targetIndex == 2) {
                        ech();
                    }
                    //if (that.targetIndex == 3) {
                    //    Tree();
                    //}
                }, 1);
            } else {
                //否则让flag标记重置
                that.flag = 0;
            }
            //重置整个滑动过程用到的变量
            that.distanceY = 0;
            that.startY = 0;
            that.isMove = false;
        });
        //测试
        /*{
         that.index = 0;
         that.parentDom.style.top = -that.index * that.height + 'px';
         document.querySelector('audio').removeAttribute('autoplay');
         }*/
        //激活第一页的动画
        that.doms[that.index].className = 'active';
    }

    //实例化
    new SwipeDom(element);
}
//音频控制封装
function player() {
    //获取要操作的元素
    var audiobox = document.querySelector('.audiobox');
    var audiobtn = audiobox.querySelector('.audiobtn');
    var audio = audiobox.querySelector('audio');
    var stopline = audiobox.querySelector('.btnline');
    //调用封装好的轻触事件
    tip(audiobtn, function () {
        if (audio.paused) {
            //判断如果是暂停状态,继续播放,动画继续旋转,隐藏斜线
            audio.play();
            audiobtn.style.animationPlayState = 'running';
            audiobtn.style.webkitAnimationPlayState = 'running';
            // stopline.style.display = 'none';
        } else {
            //如果不是暂停状态,暂停播放,动画停止旋转,显示斜线
            audio.pause();
            audiobtn.style.webkitAnimationPlayState = 'paused';
            audiobtn.style.animationPlayState = 'paused';
            // stopline.style.display = 'block';
        }
    })
    //轻触事件封装,需要传入轻触的元素和要执行的函数
    function tip(element, fn) {
        //声明变量记录时间和是否滑动
        var t = 0;
        var isMove = false;
        element.addEventListener('touchstart', function () {
            //开始触摸,记录时间,重置标记
            t = new Date().getTime();
            isMove = false;
        });
        element.addEventListener('touchmove', function () {
            //滑动,标记滑动
            isMove = true;
        });
        element.addEventListener('touchend', function () {
            //触摸结束
            if (!isMove && new Date().getTime() - t < 150) {
                //判断如果没有滑动而且时间差小于150毫秒,调用传进来的函数
                fn();
            }
            //重置标记
            isMove = false;
        });
    }
}
//技能南丁格尔玫瑰图
function ech() {
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
        title: {
            text: '南丁格尔玫瑰图-技能展示',
            textStyle:{
                color: 'skyblue'},
            x: 'left',
            y: 50
        },
        tooltip: {
            show:false
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['HTML5', 'CSS3', 'JavaScript', 'Ajax', 'Canvas', 'Nodejs', 'AngularJS', 'reactjs']
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        series: [
            {
                name: '面积模式',
                type: 'pie',
                radius: [30, 80],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '40%',               // for funnel
                max: 40,                // for funnel
                sort: 'ascending',     // for funnel
                data: [
                    {value: 20, name: 'HTML5'},
                    {value: 15, name: 'CSS3'},
                    {value: 35, name: 'JavaScript'},
                    {value: 25, name: 'Ajax'},
                    {value: 20, name: 'Canvas'},
                    {value: 35, name: 'Nodejs'},
                    {value: 30, name: 'AngularJS'},
                    {value: 40, name: 'reactjs'}
                ]
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
};
//作品展示

