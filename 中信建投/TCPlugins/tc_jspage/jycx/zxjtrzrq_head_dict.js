//['ISS_JZ','产品净值']
var zxjtrzrq_head={
	"申请管理":{
		"easyhead":{width:1106},
		"columns":[
					[["check","",{"checkbox":true}],['reqsno','申请编号',{sortable:true}],['sysdate','申请日期',{sortable:true}],['reqtype','申请类型',{sortable:true}],
					['chkdatebegin','审批开始日期',{sortable:true}],['chkdateend','审批结束日期',{sortable:true}],
					['chkamt','审批金额',{sortable:true}],['chkintrrate','审批费率(%)'],['datebegin','申请头寸开始日期'],
					['dateend','申请头寸结束日期'],['status','审批状态'],['reqamtmin','期望最小金额'],
					['reqamtmax','期望最大金额'],['reqintrrate','申请费率(%)']]
				  ]
		},

	"头寸管理":{
		"easyhead":{width:1106},
		"columns":[
					[['positionid','头寸编号',{sortable:true}],['positionname','头寸名称',{sortable:true}],['positype','头寸类型',{sortable:true}],
					['totalamt','总额',{sortable:true}],['avlamt','可用金额',{sortable:true}],['usedamt','已使用金额',{sortable:true}],
					['repayamtreal','已偿还金额',{sortable:true}],['enddate','到期日期',{sortable:true}],['fullrate','全额占用费率(%)',{sortable:true}],
					['unuserate','空闲占用费率(%)',{sortable:true}],['userate','使用费率(%)'],['intrrate','开仓费率(%)'],
					['punirate','罚息费率(%)'],['intrkind','计算央行利率(%)']]
				  ]
	},
	"融券申请管理":{
		"easyhead":{width:1106},
		"columns":[
					[["check","",{"checkbox":true}],['sysdate','申请日期',{sortable:true}],['reqsno','申请编号',{sortable:true}],['reqtype','申请类型',{sortable:true}],
					['market','交易市场',{sortable:true}],['stkcode','证券代码',{sortable:true}],['F141','证券名称',{sortable:true}],
					['datebegin','申请开始日期',{sortable:true}],['dateend','申请结束日期',{sortable:true}],
					['reqqtymin','期望最小数量',{sortable:true}],['reqqtymax','期望最大数量'],['reqintrrate','申请费率(%)'],
					['chkdatebegin','审批开始日期'],['chkdateend','审批结束日期'],['chkqtv','审批数量'],
					['chkintrrate','审批费率(%)'],['status','审批状态'],['chkremark','审批意见'],['checkdate','审批日期']]
				  ]
	},

	"融券头寸管理":{
		"easyhead":{width:1106},
		"columns":[
					[['positionid','头寸编号',{sortable:true}],['positionname','头寸名称',{sortable:true}],
					['market','交易市场',{sortable:true}],['stkcode','证券代码',{sortable:true}],['F141','证券名称',{sortable:true}],
					['positype','头寸类型',{sortable:true}],['stktotal','头寸数量',{sortable:true}],['stklast','昨日数量',{sortable:true}],
					['stkavl','实时可用',{sortable:true}],['stkused','已使用数量'],['stkusedreal','实时使用'],
					['stkrepayreal','实时已偿还'],['enddate','到期日期']]
				  ]
	}
}	
function getHead(funname){
	return zxjtrzrq_head[funname]
}

