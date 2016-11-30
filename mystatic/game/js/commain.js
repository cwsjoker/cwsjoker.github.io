// 预加载图片资源
var loadArrImg = ['images/bg.jpg', 'images/four-font.png', 'images/v-four-font.png','images/three-font.png','images/tz.png','images/music.png','images/comic.jpg','images/food.jpg','images/game.jpg','images/old.jpg','images/comicbg.png','images/food.png','images/game.png','images/things.png','images/heimao.png','images/mario.png','images/next.png','images/prve.png','images/xwg.png','images/minimg/ani1.jpg','images/minimg/ani2.jpg','images/minimg/ani3.jpg','images/minimg/ani4.jpg','images/minimg/ani5.jpg','images/minimg/ani6.jpg','images/minimg/ani7.jpg','images/minimg/ani8.jpg','images/minimg/ani9.jpg','images/minimg/ani10.jpg','images/minimg/ani11.jpg','images/minimg/ani12.jpg','images/minimg/ani13.jpg','images/minimg/ani14.jpg','images/minimg/ani15.jpg','images/minimg/ani16.jpg','images/minimg/ani17.jpg','images/minimg/ani18.jpg','images/minimg/ani19.jpg','images/minimg/ani20.jpg','images/minimg/ani21.jpg','images/minimg/ani22.jpg','images/minimg/ani23.jpg','images/minimg/ani24.jpg','images/minimg/food1.jpg','images/minimg/food2.jpg','images/minimg/food3.jpg','images/minimg/food4.jpg','images/minimg/food5.jpg','images/minimg/food6.jpg','images/minimg/food7.jpg','images/minimg/food8.jpg','images/minimg/food9.jpg','images/minimg/food10.jpg','images/minimg/food11.jpg','images/minimg/food12.jpg','images/minimg/food13.jpg','images/minimg/food14.jpg','images/minimg/food15.jpg','images/minimg/food16.jpg','images/minimg/food17.jpg','images/minimg/food18.jpg','images/minimg/food19.jpg','images/minimg/food20.jpg','images/minimg/food21.jpg','images/minimg/food22.jpg','images/minimg/food23.jpg','images/minimg/food24.jpg','images/minimg/game1.jpg','images/minimg/game2.jpg','images/minimg/game3.jpg','images/minimg/game4.jpg','images/minimg/game5.jpg','images/minimg/game6.jpg','images/minimg/game7.jpg','images/minimg/game8.jpg','images/minimg/game9.jpg','images/minimg/game10.jpg','images/minimg/game11.jpg','images/minimg/game12.jpg','images/minimg/game13.jpg','images/minimg/game14.jpg','images/minimg/game15.jpg','images/minimg/game16.jpg','images/minimg/game17.jpg','images/minimg/game18.jpg','images/minimg/game19.jpg','images/minimg/game20.jpg','images/minimg/game21.jpg','images/minimg/game22.jpg','images/minimg/game23.jpg','images/minimg/game24.jpg','images/minimg/old1.jpg','images/minimg/old2.jpg','images/minimg/old3.jpg','images/minimg/old4.jpg','images/minimg/old5.jpg','images/minimg/old6.jpg','images/minimg/old7.jpg','images/minimg/old8.jpg','images/minimg/old9.jpg','images/minimg/old10.jpg','images/minimg/old11.jpg','images/minimg/old12.jpg','images/minimg/old13.jpg','images/minimg/old14.jpg','images/minimg/old15.jpg','images/minimg/old16.jpg','images/minimg/old17.jpg','images/minimg/old18.jpg','images/minimg/old19.jpg','images/minimg/old20.jpg','images/minimg/old21.jpg','images/minimg/old22.jpg','images/minimg/old23.jpg','images/minimg/old24.jpg']; 
//初始化做布局，适应个移动端分辨率 
$(window).ready(function(){
	var fontSize = parseFloat($('body').css('font-size'));
	// 首页底部居中
	var intoH = ($('body').height() - $('.index-bg').height()) / fontSize;
	$('.into').css({
		'height' : intoH + 'rem'
	});
	//选择卡牌居中
	var chooseTP = (($('body').height() - $('.choose header').height() - $('.choose .container').height()) / 2) / fontSize;
	$('.choose .container').css({
		'marginTop' : chooseTP + 'rem'
	});
	//游戏居中
	var gameingTP = (($('body').height() - $('.gameing header').height() - $('.gameing .con').height())/2)/fontSize;
	$('.gameing .con').css({
		'marginTop' : gameingTP + 'rem'
	});
	//回忆童年居中 
	var rechildPT = (($('body').height() - (32.45 * fontSize)) / 2) / fontSize;
	$('.childScroll').css({
		'paddingTop' : rechildPT + 'rem'
	});
	$('.childhood').css({'display' : 'none'});
	$('.choose').css({'display' : 'none'});
	$('.gameing').css({'display' : 'none'});
	$('.passone').css({'display' : 'none'});
	$('.agingame').css({'display' : 'none'});
	$('.th-allrank').css({'display' : 'block'});
	$('.rechild').css({'display' : 'none'});
	$('.endpage').css({'display' : 'none'});
	//加载音频
	audio.src = 'media/bac.mp3';
	audio.loop = 'loop';
	audio.load();
	// 加载图片
	for (var i = 0; i < loadArrImg.length; i++) {
		var img = new Image();
		img.src = loadArrImg[i];
	};
	// 去除loading图
	setTimeout(function() {
		$('.loading').css({'display' : 'none'});
		audio.play();
	},2000);
});
// 设置音频开关
var audio = document.createElement('audio');
var musicBtn = false;
$('.childhood .music').on('touchstart', function() {
	if(!musicBtn){
		audio.pause();
		musicBtn = true;
	}else{
		audio.play();
		musicBtn = false;
	}
});

// 为各个卡牌添加开关
function resetBtn() {
	$('.gameing .con').find('div').each(function() {
		$(this).attr('dgBtn', 'ok');
	});
}
var scrollBtn = true,//滚动开关
	rankBtn = true,
	boxIndex = 1,//当前滑动到第几张
	scrollIndex = 0,//
	result = null,//
	bgsrc = '',//当前卡牌类型背景图片
	seconds = 0,//计时器秒
	msseconds = 0,//计时器毫秒
	rankNum = 0,//当前关卡
	nowType = 'ani',//当前卡牌类型
	arr = [],	//存放1-24的数组
	rankArr = [],//存放打乱的数组
	rankSectionArr = [], //存放小关数组
	timer = null,//计时器
	downNum = 0,//当前翻转的卡牌数
	code1 = 0,//第一个卡牌的下标值
	code2 = 0,//
	imgone = null,//第一个卡牌对象
	imgtwo = null,//
	imgRotateNum = 0;//当前关卡已点对几对图
for (var i = 0; i < 24; i++) {
	arr.push(i+1);
};
//打乱数组
function upsetArr(arr) {
	var temp;
	var newarr = arr;
   	for (var i = newarr.length; i > 0; i--) {
   		var num = Math.floor(Math.random() * i);
   		temp = newarr[i-1];
   		newarr[i-1] = newarr[num];
   		newarr[num] = temp;
   	};
   	return newarr;
}
//设置关卡时间
function ranksetTime() {
	msseconds = 1;
	if(rankNum == 1) {
		seconds = 30;
	}else if(rankNum == 2) {
		seconds = 25;
	}else if(rankNum == 3) {
		seconds = 20;
	}else{
		return;
	}
	if(timer) {
		clearInterval(timer);
	}
	timer = setInterval(changeTime, 10);
	$('.gameing .cover').css({'display' : 'none'});
	resetBtn();
}
//事件运动函数
function changeTime() {
	//游戏结束
	msseconds--
	if(msseconds == 0){
		seconds--;
		msseconds = 100;
	}
	if(seconds < 0) {
		clearInterval(timer);
		imgRotateNum = 0;
		nowType = '';
		$('.gameing').css({'display' : 'none'});
		$('.agingame').css({'display' : 'block'});
		// 设置第一关标题和时间
		$('.gameing .game-rank .rank').html('01');
		$('.game-time').html('30:00');
	}
	$('.game-time').html(changeNum(seconds) + ':' + changeNum(msseconds));
}
//小于10加0函数
function changeNum(num){
	if(num < 10){
		return '0'+num;
	}else{
		return num;
	}
}
// 跟去下标值取打乱总数组的八位数的数组
function setRankArr() {
	rankSectionArr = [];
	//得到当前管卡的八张图片数组
	for (var i = 8 * (rankNum - 1); i < 8 * rankNum; i++) {
		rankSectionArr.push(rankArr[i]);
	};
	//将八张图片复制一份并打乱图片数据
	for (var i = 0; i < 8; i++) {
		rankSectionArr.push(rankSectionArr[i]);
	};
	rankSectionArr = upsetArr(rankSectionArr);
}

//游戏结束卡牌全部翻回来
function inti() {
	$('.gameing .con').find('div').removeClass('changeRotate');
	$('.gameing .con').find('div').find('img').attr('src', '');
}

//给图片加上src
function setImgSrc() {
	if(nowType == 'ani') {
		bgsrc = 'images/comicbg.png';
	}else if(nowType == 'food') {
		bgsrc = 'images/food.png';
	}else if(nowType == 'game') {
		bgsrc = 'images/game.png';
	}else if(nowType == 'old') {
		bgsrc = 'images/things.png';
	}else {
	}
	$('.gameing .con').find('div').find('.front-img').attr('src', bgsrc);
	var	imgArr = $('.gameing .con').find('div').find('.back-img');
	for (var i = 0; i < imgArr.length; i++) {
		imgArr.eq(i).attr('src', 'images/minimg/' + nowType + rankSectionArr[i] + '.jpg');
	};
}
//判断两张图片能否相同
function dujge() {
	if(code1 != code2) {
		imgone.removeClass('changeRotate');
		imgtwo.removeClass('changeRotate');
		imgone.attr('dgBtn', 'ok');
		imgtwo.attr('dgBtn', 'ok');
	}else{
		imgRotateNum++;
		if(imgRotateNum == 8) {
			if(timer) {
				clearInterval(timer);
			}
			//判断是否通关
			if(rankNum == 3) {
				$('.gameing').css({'display' : 'none'});
				$('.th-allrank').css({'display' : 'block'});
				$('.gameing .game-rank .rank').html('01');
				$('.game-time').html('30:00');
			}else{
				if(rankNum == 1){
					$('.passone .game-rank').find('.rank').html('01');
				}else{
					$('.passone .game-rank').find('.rank').html('02');
				}
				$('.gameing').css({'display' : 'none'});
				$('.passone').css({'display' : 'block'});
			}
			imgRotateNum = 0;
		}
		// 让匹配对的图片消失
		imgone.css({'opacity' : 0});
		imgtwo.css({'opacity' : 0});
	}
	code1 = 0;
	code2 = 0;
	imgone = null;
	imgtwo = null;
	setTimeout(function() {
		$('.gameing .cover').css({'display' : 'none'});
	}, 100);
}
function startShow() {
	for (var i = 0; i < $('.gameing .con').find('div').length; i++) {
		$('.gameing .con').find('div').eq(i).css({'opacity' : 1});
	};
	$('.gameing .con').find('.back-img').removeClass('changeRotateYimg');
	$('.gameing .con').find('.front-img').addClass('changeRotateYimg');
	setTimeout(function() {
		$('.gameing .con').find('.front-img').removeClass('changeRotateYimg');
		$('.gameing .con').find('.back-img').addClass('changeRotateYimg');
		ranksetTime();	//设置关卡时间
	}, 2000);
}
//加载滚动数据
function addImgBox() {
	scrollIndex++;
	for (var i = (scrollIndex - 1) * 3; i < (scrollIndex * 3); i++) {
		var childbox = $('<div class="childbox"></div>');
		var imgbox = $('<div class="box-img"></div>');
		var img = $('<img>');
		console.log(i);
		img.attr('src', result[i].src);
		img.appendTo(imgbox);
		var inf = $('<div class="box-inf"></div>');
		inf.html(result[i].inf);
		var title = $('<div class="box-title"></div>');
		var titleP = result[i].title;
		var arrP = titleP.split('');
		for (var j = 0; j < arrP.length; j++) {
			var sp = $("<span></span>");
			sp.html(arrP[j]);
			sp.appendTo(title);
		};
		title.appendTo(childbox);
		imgbox.appendTo(childbox);
		inf.appendTo(childbox);
		childbox.appendTo($('.childScroll'));
	};
}
// 点击进入选择卡牌类型的图片
$('.into').on('touchend', function(){
	$('.childhood').css({'display' : 'none'});
	$('.choose').css({'display' : 'block'});
});

//选择卡牌
$('.choose').find('dd').on('touchend', function(){
	if(!rankBtn){
		return;
	}
	rankBtn = false;
	//获取1-24打乱数组，获取当前选择卡牌类型，设置关卡数为1，把已经翻转的卡牌翻转,并清除图片src的属性
	//重新打乱总数组，保证随机性
	rankArr = upsetArr(arr);
	nowType = '';
	nowType = $(this).attr('ty');
	rankNum = 1;
	inti();
	setRankArr();
	//给图片加上判断src
	setImgSrc();
	setTimeout(function() {
		$('.choose').css({'display' : 'none'});
		$('.gameing').css({'display' : 'block'});
		$('.gameing .cover').css({'display' : 'block'});
		startShow();
		rankBtn = true;
	},1000);
})
//开始游戏
$('.gameing .con').find('div').on('touchstart', function() {
	if($(this).attr('dgBtn') == 'no'){
		return;
	}
	downNum++;
	$(this).addClass('changeRotate');
	if(downNum == 1){
		$(this).attr('dgBtn', 'no');
		code1 = rankSectionArr[$(this).index()];
		imgone = $(this);
		return;
	}else if(downNum == 2) {
		$(this).attr('dgBtn', 'no');
		code2 = rankSectionArr[$(this).index()];
		imgtwo = $(this);
		downNum = 0;
		$('.gameing .cover').css({'display' : 'block'});
		setTimeout(function() {
			dujge();
		}, 500);
	}else {
	}
});

//下一关
$('.passone .next-rank').on('click', function() {
	if(!rankBtn){
		return;
	}
	rankBtn = false;
	if(timer) {
		clearInterval(timer);
	}
	//增加一关，选出下关数组，设置下关图片，设置下关时间
	rankNum++;
	inti();
	setRankArr();
	setImgSrc();
	// 显示下关界面
	setTimeout(function() {
		if(rankNum == 2){
			$('.gameing .game-rank .rank').html('02');
			$('.game-time').html('25:00');	
		}else{
			$('.gameing .game-rank .rank').html('03');
			$('.game-time').html('20:00');	
		}
		$('.passone').css({'display' : 'none'});
		$('.gameing').css({'display' : 'block'});
		startShow();
		rankBtn = true;
	},1000)
});

//再来一次
$('.agingame .word-agin').on('click', function() {
	seconds = 0;
	$('.gameing .game-rank .rank').html('01');
	$('.game-time').html('30:00');
	$('.agingame').css({'display' : 'none'});
	$('.choose').css({'display' : 'block'});
});

//通关追寻童年记忆
$('.th-allrank .into-childhood').on('click', function() {
	seconds = 0;
	var fileSrc = "";
	if(nowType == 'ani') {
		fileSrc = './js/imagesAni.json';
	}else if(nowType == 'food') {
		fileSrc = './js/imagesFood.json';
	}else if(nowType == 'game') {
		fileSrc = './js/imagesGame.json';
	}else if(nowType == 'old') {
		fileSrc = './js/imagesOld.json';
	}else {
	}
	console.log(fileSrc);
	$.getJSON(fileSrc,function(data){
		result = data;
		console.log(result);
		addImgBox();	
	});
	$('.th-allrank').css({'display' : 'none'});
	$('.rechild').css({'display' : 'block'});
})
//通关玩玩其他卡牌
$('.th-allrank .into-other').on('click', function() {
	seconds = 0;
	nowType = '';
	$('.th-allrank').css({'display' : 'none'});
	$('.choose').css({'display' : 'block'});
})
//滚屏下一页
$('.rechild').swipeLeft(function(){
	if(!scrollBtn){
		return;
	}
	boxIndex++;
	if(boxIndex == 25){
		$('.rechild').css({'display' : 'none'});
		$('.endpage').css({'display' : 'block'});
		scrollBtn = true;
		boxIndex = 1;
		return;
	}
	if(boxIndex == (scrollIndex * 3) - 1){
		if(scrollIndex < 8){
			addImgBox();
		}
	}
	scrollPage();
});
//滚屏到上一页
$('.rechild').swipeRight(function(){
	if(!scrollBtn){
		return;
	}
	boxIndex--;
	if(boxIndex == 0){
		boxIndex = 1;
		return;
	}
	scrollPage();
});
// 滚屏方法
function scrollPage() {
	if(boxIndex == 24) {
		$('.child-next').css({'display' : 'none'});
	}else {
		$('.child-next').css({'display' : 'block'});
	}
	scrollBtn = false;
	var parentP = $('.childbox').eq(boxIndex - 1).position();
	var translateX = 'translate3D(-' + parentP.left + 'px, 0px, 0px)';
	$('.childScroll').css({
		'transform' : translateX,
		'-webkit-transform' : translateX,
		'-moz-transform' : translateX,
		'-ms-transition' : translateX
	});
}
// 防止用户多次滑动动画跟不上
$('.childScroll').on('webkitTransitionEnd msTransitionend mozTransitionend transitionend',function(){
	scrollBtn = true;
});

//玩玩其他类型的卡牌
$('.endpage .game-other').on('touchstart', function(){
	nowType = '';
	scrollIndex = 0;
	$('.childScroll').html('');
	$('.childScroll').css({
		'-webkit-transform' : 'translate3d(0px, 0px, 0px)'
	});
	$('.endpage').css({'display' : 'none'});
	$('.choose').css({'display' : 'block'});
});