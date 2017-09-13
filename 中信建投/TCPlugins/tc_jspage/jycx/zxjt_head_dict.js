//['ISS_JZ','产品净值']
var zxjt_head={
	"产品信息":{
		"easyhead":{/*width:1006*/},
		"columns":[
				[['prodcode','产品代码'],['productname','产品名称'],['isscode','发行人代码'],['risk_lvl','风险级别'],
					['insttype','产品大类'],['lastnet','产品净值',{"sorttype":"float"}],['iss_stat','发行状态']
				]
			]
		},
	"银行产品信息":{
	"easyhead":{/*width:1006*/},
	"columns":[
			[['prodcode','产品代码'],['productname','产品名称'],['estyield','预期年化收益率(%)'],['salebgndate','销售起始日'],
			['saleenddate','销售终止日'],['interestdate','起息日'],['expirydate','到期日'],
			['min_subs_amt','最低认购金额'],['risk_lvl','风险级别'],['iss_stat','发行状态'],['gtjybs','柜台交易标识'],['isscode','发行人代码']
			]
		]
	},

	"认购":{
		"easyhead":{/*width:1006*/},	
		"columns":[
					[['prodcode','产品代码'],['productname','产品名称'],['insttype','产品大类'],['isscode','发行人代码'],
					 ['lastnet','产品净值',{"sorttype":"float"}],['risk_lvl','风险级别'],['iss_stat','发行状态'],['min_subs_amt','最低认购金额',{"sorttype":"float"}],
					 ['max_subs_amt','最高认购金额',{"sorttype":"float"}],['iss_end_date','发行终止日期']
					]
			 ]
		},

	"银行产品认购":{
	"easyhead":{/*width:1006*/},
	"columns":[
				[['prodcode','产品代码'],['productname','产品名称'],['estyield','预期年化收益率(%)'],['salebgndate','销售起始日'],
				['saleenddate','销售终止日'],['interestdate','起息日'],['expirydate','到期日'],
				['min_subs_amt','最低认购金额'],['risk_lvl','风险级别'],['gtjybs','柜台交易标识'],['isscode','发行人代码']
				]
		 ]
	},

	"申购":{
		"easyhead":{/*width:1106*/},
		"columns":[
				[['prodcode','产品代码'],['productname','产品名称'],['insttype','产品大类'],['isscode','发行人代码'],
					['lastnet','产品净值'],['risk_lvl','风险级别'],['iss_stat','发行状态'],['min_bids_amt','最低申购金额',{"sorttype":"float"}],
					['max_bids_amt','最高申购金额',{"sorttype":"float"}],['end_date','产品终止日期']
					]
		]
		},
	"赎回":{
		"easyhead":{/*width:1006*/},
		"columns":[
				[['prodcode','产品代码'],['productname','产品名称'],['isscode','发行人代码'],['INST_BLN','份额余额',{"sorttype":"float"}],
					['ofavl','可用份额',{"sorttype":"float"}],['marketvalue','最新市值',{"sorttype":"float"}],['lastnet','产品净值',{"sorttype":"float"}],['currentcost','买入成本',{"sorttype":"float"}],
					['end_date','产品终止日期']
					]
			 ]
		},
	"撤单":{
		"easyhead":{multiselect: true},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],
					['prodcode','产品代码'],['productname','产品名称'],['isscode','发行人代码'],['trdid','买卖标志'],
					['ord_stat','状态说明'],['orderamt','委托金额'],['stkqty','委托数量'],['orderfrzqty','冻结数量'],
					['cancelqty','撤单数量'],['confirmedamt','成交金额'],['confirmedqty','成交数量']
					]
					]
		},

	"银行产品撤单":{
		"easyhead":{multiselect: true},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],
					['prodcode','产品代码'],['productname','产品名称'],
					['trdid','买卖标志'],['ord_stat','状态说明'],['orderamt','委托金额'],['stkqty','委托数量'],
					['confirmedamt','成交金额'],['confirmedqty','成交数量'],['isscode','发行人代码']
					]
					]
		},

	
	"意向买入":{
		"easyhead":{/*width:2206*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					['F392','产品名称'],['F257','买卖标志'],['F258','意向约定'],['F145','委托价格'],
					['F144','委托数量'],['F106','联系人姓名'],['F495','联系人电话'],['F259','有效日期'],
					['F147','状态说明'],['F157','成交数量']					
					]
				  ]
		},
	"意向卖出":{
		"easyhead":{/*width:2206*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					['F392','产品名称'],['F257','买卖标志'],['F258','意向约定'],['F145','委托价格'],
					['F144','委托数量'],['F106','联系人姓名'],['F495','联系人电话'],['F259','有效日期'],
					['F147','状态说明'],['F157','成交数量']					
					]
				  ]
		},
	"定价买入":{
		"easyhead":{/*width:2306*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					 ['F392','产品名称'],['F257','申买价格'],['F258','申买数量'],['F145','申卖价格'],
					 ['F144','申卖数量'],['F259','有效日期'],['F250','报价类型'],['F147','状态说明'],
					 ['F252','买入成交数量'],['F253','卖出成交数量']					
					]
				  ]
		},
	"定价卖出":{
		"easyhead":{/*width:2306*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					 ['F392','产品名称'],['F257','申买价格'],['F258','申买数量'],['F145','申卖价格'],
					 ['F144','申卖数量'],['F259','有效日期'],['F250','报价类型'],['F147','状态说明'],
					 ['F252','买入成交数量'],['F253','卖出成交数量']					
					]
				  ]
		},
	"确认买入":{
		"easyhead":{/*width:1906*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					['F392','产品名称'],['F257','买卖标志'],['F258','意向约定'],['F145','委托价格'],
					['F144','委托数量'],['F106','联系人姓名'],['F495','联系人电话'],['F259','有效日期'],
					['F147','状态说明'],['F157','成交数量']				
					]
				  ]
		},
	"确认卖出":{
		"easyhead":{/*width:1906*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					['F392','产品名称'],['F257','买卖标志'],['F258','意向约定'],['F145','发生价格'],
					['F144','发生数量'],['F106','联系人姓名'],['F495','联系人电话'],['F259','有效日期'],
					['F147','状态说明'],['F157','成交数量']				
					]
				  ]
		},
	"预约认购":{
		"easyhead":{/*width:1006*/},
		"columns":[
					[['prodcode','产品代码'],['productname','产品名称'],['insttype','产品大类'],['isscode','发行人代码'],
					 ['lastnet','产品净值'],['risk_lvl','风险级别'],['iss_stat','发行状态'],['min_subs_amt','最低认购金额'],
					 ['max_subs_amt','最高认购金额'],['recm_end_date','推介终止日期']					
					]
				  ]
		},
	"预约撤单":{
		"easyhead":{multiselect: true},
		"columns":[
					[['booksno','委托编号'],['sysdate','预约日期'],['apptimestamp','预约时间'],
					 ['prodcode','产品代码'],['productname','产品名称'],['isscode','发行人代码'],['trdid','买卖标志'],
					 ['bookstat','状态说明'],['orderamt','委托金额'],['stkqty','委托数量'],['orderfrzqty','冻结数量'],
					 ['cancelqty','撤单数量'],['canceledflag','撤单标志']
					]
				  ]
		},
	"委托查询":{
		"easyhead":{/*width:1706*/},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],['prodcode','产品代码'],
					 ['productname','产品名称'],['isscode','发行人代码'],['trdid','买卖标志'],['ord_stat','状态说明'],
					 ['orderamt','委托金额'],['stkqty','委托数量'],['orderfrzqty','冻结数量'],['cancelqty','撤单数量'],
					 ['confirmedamt','成交金额'],['confirmedqty','成交数量']					
					]
				]
		},

	"银行产品委托查询":{
		"easyhead":{/*width:1706*/},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],
					['prodcode','产品代码'],['productname','产品名称'],
					['trdid','买卖标志'],['ord_stat','状态说明'],['orderamt','委托金额'],['stkqty','委托数量'],
					['confirmedamt','成交金额'],['confirmedqty','成交数量'],['isscode','发行人代码']	
					]
				]
		},


	"成交查询":{
		"easyhead":{/*width:1506*/},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['marketmatchedtime','成交日期'],['matchtime','成交时间'],
					 ['prodcode','产品代码'],['productname','产品名称'],['trdid','买卖标志'],['orderprice','委托价格'],
					 ['orderqty','委托数量'],['matchprice','成交价格'],['matchqty','成交数量'],['matchedamt','成交金额'],
					 ['promiseno','约定编号']
					]
				  ]
		},

		"银行产品成交查询":{
		"easyhead":{/*width:1506*/},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['cfm_date','成交日期'],['prodcode','产品代码'],
					 ['productname','产品名称'],['trdid','买卖标志'],
					 ['orderprice','委托价格'],['orderqty','委托数量'],['orderamt','委托金额'],['matchedamt','成交金额'],
					 ['matchqty','成交数量'],['matchprice','成交价格'],['isscode','发行人代码']
					]
				  ]
		},

		
	"份额查询":{
		"easyhead":{/*width:1008*/},
		"columns":[
					[['prodcode','产品代码'],['productname','产品名称'],['isscode','发行人代码'],['instbln','份额余额'],
					 ['ofavl','可用份额'],['marketvalue','最新市值'],['nav','产品净值'],['currentcost','买入成本'],['end_date','产品终止日期']
					]
					]
		},


	"银行产品份额查询":{
		"easyhead":{/*width:1008*/},
		"columns":[
					[['prodcode','产品代码'],['productname','产品名称'],['instbln','当前数量'],
					['ofavl','可用份额'],['insttrdfrz','冻结数量'],['currentcost','参考成本'],
					['nav','参考净值'], ['marketvalue','最新市值'],
					['risk_lvl','风险级别'],['isscode','发行人代码']
					]
					]
		},

	"资金查询":{
		"easyhead":{/*width:1006*/},
		"columns":[
						[['fundid','资产账户'],['currency','币种'],['fundbal','资金余额',{"sorttype":"float"}],['FUND_AVL','fundavl',{"sorttype":"float"}]]
				  ]
		},
	"行情查询":{
		"easyhead":{/*width:1906*/},
		"columns":[
					[['F391','产品代码'],['F392','产品名称'],['F393','发行人代码'],['F389','产品净值',{"sorttype":"float"}],
					 ['F259','累计净值',{"sorttype":"float"}],['F946','昨收价',{"sorttype":"float"}],['F945','今开价',{"sorttype":"float"}],['F153','最新成交价格',{"sorttype":"float"}],
					 ['F152','最新成交数量',{"sorttype":"float"}],['F144','最优申买数量',{"sorttype":"float"}],['F257','最优申卖数量',{"sorttype":"float"}],['F145','最优申买价格',{"sorttype":"float"}],
					 ['F256','最优申卖价格',{"sorttype":"float"}],['F255','申买家数',{"sorttype":"float"}],['F258','申卖家数',{"sorttype":"float"}],['F632','今日成交金额',{"sorttype":"float"}],			
					 ['F631','今日成交数量',{"sorttype":"float"}]					
					]
				  ]
		},
	"成交申报撤单":{
		"easyhead":{multiselect: true},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],
					 ['prodcode','产品代码'],['productname','产品名称'],['trdid','买卖标志'],['orderprice','委托价格'],
					 ['orderqty','委托数量',{"sorttype":"float"}],['orderamt','委托金额',{"sorttype":"float"}],['orderfrzqty','冻结数量',{"sorttype":"float"}],['cancelqty','撤单数量',{"sorttype":"float"}],
					 ['matchprice','成交价格',{"sorttype":"float"}],['matchqty','成交数量',{"sorttype":"float"}],['ord_stat','订单状态'],['promiseno','约定编号'],
					 ['cancelflag','撤单标志']					
					]
					]
		},
	"意向报价撤单":{
		"easyhead":{multiselect: true},
		"columns":[
					[['declid','委托编号'],['opendate','委托日期'],['apptimestamp','委托时间'],
					['prodcode','产品代码'],['productname','产品名称'],['trdid','买卖标志'],['matchtype','意向约定'],
					['trdprice','委托价格'],['stkqty','委托数量'],['linkman','联系人姓名'],['linktelno','联系电话'],
					['promiseno','约定编号'],['expdate','有效日期'],['ord_stat','状态说明']					
					]
					]
		},
	"成交申报查询":{
		"easyhead":{},
		"columns":[
					[['declid','委托编号'],['operdate','委托日期'],['apptimestamp','委托时间'],
					 ['prodcode','产品代码'],['productname','产品名称'],['trdid','买卖标志'],['orderprice','委托价格'],
					 ['orderqty','委托数量'],['orderamt','委托金额'],['orderfrzqty','冻结数量'],['cancelqty','撤单数量'],
					 ['matchprice','成交价格'],['matchqty','成交数量'],['ord_stat','订单状态'],['promiseno','约定编号'],
					 ['cancelflag','撤单标志']
					]
					]
		},
		"意向申报查询":{
		"easyhead":{/*width:1506*/},
		"columns":[
					[['declid','委托编号'],['opendate','委托日期'],['apptimestamp','委托时间'],['prodcode','产品代码'],
					 ['productname','产品名称'],['trdid','买卖标志'],['matchtype','意向约定'],['trdprice','委托价格'],
					 ['stkqty','委托数量'],['linkman','联系人姓名'],['linktelno','联系电话'],['promiseno','约定编号'],
					 ['expdate','有效日期'],['ord_stat','状态说明']					
					]
				  ]
		},
		"意向信息查询":{
		"easyhead":{/*width:1306*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					 ['F392','产品名称'],['F257','买卖标志'],['F258','意向约定'],['F145','委托价格'],
					 ['F144','委托数量'],['F106','联系人姓名'],['F495','联系人电话'],['F259','有效日期'],
					 ['F147','状态说明'],['F157','成交数量']
					]
				  ]
		},
		"风险承受能力":{
		"easyhead":{/*width:1306*/},
		"columns":[
					[ ['org_name','评价机构名称'],['eval_lvl','当前风险评价类型'],['eval_score','当前风险评价得分'],['eval_date','评估日期']
					 ]
				  ]
		},
		"定价信息查询":{
		"easyhead":{/*width:1006*/},
		"columns":[
					[['F146','委托编号'],['F142','委托日期'],['F143','委托时间'],['F391','产品代码'],
					 ['F392','产品名称'],['F257','申买价格'],['F258','申买数量'],['F145','申卖价格'],
					 ['F144','申卖数量'],['F259','有效日期'],['F250','报价类型'],['F147','状态说明'],
					 ['F252','买入成交数量'],['F253','卖出成交数量']					
					]
				  ]
		}
}	
function getHead(funname){
	return zxjt_head[funname]
}

function getjqHead(name){
	var jq={},column=[];
	//alert("222")
	jq["head"]=$.extend({},{
		datatype: "local",
        multiselect: false, 
        viewsortcols:[false,'vertical',true],
        height:"auto",
        loadui:"enable",
        shrinkToFit:false,
        forceFit:false,
        altRows:true,
        altclass:"jqalt",
        emptyrecords:"无数据",
      	loadtext:"数据请求中,请稍后",
      	//loadtext:"",
        caption: ""
       
    },zxjt_head[name]["easyhead"])
	jq["head"]["colNames"]=[]
	
	$.each(zxjt_head[name]["columns"][0],function(k,v){
		//alert(v)
		jq["head"]["colNames"].push(v[1])
		if(v.length==3){
			column.push($.extend({},{align:'right',width:100},v[2],{name:v[0],index:v[0]}))
		}else{
			column.push($.extend({},{align:'right',width:100},{name:v[0],index:v[0]}))
		}
	})
	
	jq["column"]=column
	
	return jq
}
