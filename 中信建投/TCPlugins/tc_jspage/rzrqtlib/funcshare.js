
function ResumeError(e) {   //禁止IE弹出错误某种提示

		return true;
	}
//window.onerror = ResumeError;

forEach = function(func,array){
	for(var i=0;i<array.length;i++)
		func(array[i]);
}

fmtStr = function() {
	var fmt = arguments[0],tS = fmt.split("%s"),rtn = new Array(); 
	for(var i = 0; i < tS.length; i++){
		rtn.push(tS[i]);
		if( i + 1 < arguments.length && i != tS.length - 1)
			rtn.push(arguments[i + 1]);
	}
	return rtn.join(''); 
};

fmtFloat = function(fixed,d){
	var d=d||1;var fx=fixed||2;
	function ft(v){
		var f=parseFloat(v)
		return !isNaN(f)?parseFloat((f/d).toFixed(fx)):0.00
	}
	return ft 
}

fmtFloat2Str = function(fixed,d){
	var d=d||1;var fx=fixed||2;
	function ft(v){
		var f=parseFloat(v)
		return !isNaN(f)?(f/d).toFixed(fx):"--"
	}
	return ft 
}

fmtInt = function(v){
	return !isNaN(v)?v:"--"
}

/*空字符串的处理*/
fmtEmpty = function(v){

	return (v==""||v==null||v==undefined)?"--":v
}

// 当数字无效时，当做0来处理
parseFloat0 = function(num){
	return parseFloat((num==null||num==undefined||num=='')?0:num);
}

// 按float的大小排序
sortFloat= function(a,b){
	a = parseFloat0(a);
	b = parseFloat0(b);
	return (a>=b)?1:-1;
}

mergeObj = function(o1, o2)
{
	var i, k;
	if (!o1)
	{
		o1 = {};
	}
	if (o2)
	{
		for (k in o2)
		{
			if (typeof(o2[k]) != 'undefined')
			{
				o1[k] = o2[k];
			}
		}
	}
	return o1;
};

fmtConst = function(data){
	var const_id={}
	for (value in data){
		
		if(const_id[data[value][0]]==undefined)
			const_id[data[value][0]]={}
		const_id[data[value][0]][data[value][1]]=data[value][2]
	}
	return const_id;
}

transID = function(const_id,ID){
	var conid=const_id[ID] == undefined ? {} : const_id[ID];
	return function(code){
		return emptyFmt(conid[code]);
	}
}



/*将数字转变成千分号分隔形式的字符串*/
formatNumberRgx = function(num) {
	if (num == null || num == ""||num==0)
		return "--"
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//将空值转换为0
null2Zero = function(s){
	if(s==""||s==null||s=="null"||s==undefined){
		return "0";
	}
	return s;
}

//判断字符串是否全为英文字母
isLetter = function(a){
	var pattern=/^[A-Za-z]+$/;
	return pattern.test(a);
}

//判断字符串是否全为数字
isNum = function(a){
	var pattern=/^\d*$/;
	return pattern.test(a);
}

//清空字符串左右两边空格
trim = function(str){   
    return str.replace(/(^\s*)|(\s*$)/g, "");   
 } 

// 格式和日期，flag:中间间隔符可以自定义,默认为"-",YYYY-MM-DD
formatDate = function(d,flag){
	if (d ==''|| d ==null || d==undefined) return '';
	if(d.constructor==Date){
		var year = d.getFullYear();
		var month = d.getMonth()+1;
		month = (month<10)?('0'+month):month;
		var day = d.getDate();
		if(day<10) day = "0" + day;

		if(flag==null || flag==undefined) flag="-";
		var strDate = year.toString()+flag+month.toString()+flag+day.toString();
		return strDate;
	}
	d = d.toString();
	if(d.length!=8)
		return d;
	if(flag==null || flag==undefined) flag="-";
	return d.slice(0, 4)+flag+d.slice(4, 6)+flag+d.slice(6,8);
}

fmtDate = function(flag){
	flag = flag || "-";
	function ft(d){
		d=d.toString()
		if(d.length!=8)
			return d;
		return d.slice(0, 4)+flag+d.slice(4, 6)+flag+d.slice(6,8)
	}
	return ft
}

// 将日期转变成Date类型格式
toDate = function(obj){
	if(obj=="" || obj==null || obj==undefined) return null;
	if (obj.constructor==Date) {
		return obj;
	};
	obj = obj.toString();
	var year = parseInt(obj.substring(0,4));
	var month = parseInt(obj.substring(4,6))-1;
	var day = parseInt(obj.substring(6,8));
	var days = new Date(year,month,day);
	return days;
}

// 得到某一日期之前或之后的n天
// <0,之前;>0，之后
addDays = function(obj,delta,flag){
	var days = toDate(obj);
 	days.setDate(days.getDate()+delta);
 	return formatDate(days,flag);
}


// 得到某一日期之前或之后的n月
// <0,之前;>0，之后
addMonths = function(obj,delta,flag){
	var months = toDate(obj);
	months.setMonth(months.getMonth() + delta);
	return formatDate(months,flag);
}

// 得到某一日期之前或之后的n年
// <0,之前;>0，之后
addYears = function(obj,delta,flag)
{
	var years = toDate(obj);
	years.setYear(years.getFullYear()+delta);
	return formatDate(years,flag);
}

// 得到当前日期
// flag：自定义间隔符 YYYY-MM-DD YYYY.MM.DD等
getCurDate = function(flag){
	var date = new Date();
	return formatDate(date,flag);
}

function addDate(dateflag,add,date){
	if(dateflag=="y"){
		date.setYear(date.getFullYear()+add);
		return date;
	}
	else if(dateflag=="m"){
		date.setMonth(date.getMonth()+add);
		return date;
	}
	else if(dateflag=="d"){
		date.setDate(date.getDate()+add);
		return date;
	}
}