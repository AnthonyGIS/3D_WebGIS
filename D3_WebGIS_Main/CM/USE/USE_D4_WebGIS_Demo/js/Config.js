define([],function(){
	var SORT_NUM = 1;
	var Config = {
			TitleKeyMap : {
				'text' : '矢量（全国省份）',
				'Line' : '矢量（全国省份）',
				'专题图' : '矢量（全国省份）',
				'Tree@新CBD' : 'CBD',
				'Ground_2@新CBD' : 'CBD',
				'Ground_1@新CBD' : 'CBD',
				'Building@新CBD' : 'CBD',
				'Ground@OlympicGreen' : '奥林匹克公园',
				'Billboard@OlympicGreen' : '奥林匹克公园',
				'Building@OlympicGreen' : '奥林匹克公园',
				'Tree@OlympicGreen' : '奥林匹克公园',
				'Waters@OlympicGreen' : '鸟巢',
				'jinjiang' : '晋江',
				'all' : '点云',
				'srsb' : '萨尔茨堡',
				'T8H_NoLod' : 'BIM(8号楼)',
				'srsb_etc' : '萨尔茨堡（android）',
				'srsb_pvr' : '萨尔茨堡（IOS）',
				'image' : '珠峰影像',
				'info' : '珠峰地形',
				'canbarra' : '堪培拉',
				'sci_park' : '香港科技园',
				'NewConfig' : '耶路撒冷',
				'siguniang' : '四姑娘山',
				'zf_pc' : '珠峰',
				'zf_ios' : '珠峰(IOS)',
				'zf_android' : '珠峰(Android)',
				'CBD_ALL' : 'CBD',
				'鸟巢五期' : '鸟巢',
				'jinshanling_pvr' : '金山岭',
				'水面@vector' : '萨尔茨堡',
				'萨尔茨堡_居民区' : '萨尔茨堡_圣安德烈教堂',
				'萨尔茨堡_学校' : '萨尔茨堡_莱希勒公园'
			},
			NameKeyMap : {
				'text' : '矢量（全国省份名字）',
				'Line' : '矢量（全国省份边界）',
				'专题图' : '矢量（全国省份区域）',
				'Tree@新CBD' : 'CBD(树木)',
				'Ground_2@新CBD' : 'CBD(地面2)',
				'Ground_1@新CBD' : 'CBD(地面1)',
				'Building@新CBD' : 'CBD(建筑)',
				'shuimian@新CBD' : 'CBD(水面)',
				'Ground@OlympicGreen' : '奥林匹克公园（地面）',
				'Billboard@OlympicGreen' : '奥林匹克公园（人）',
				'Building@OlympicGreen' : '奥林匹克公园（建筑物）',
				'Tree@OlympicGreen' : '奥林匹克公园（树木）',
				'Waters@OlympicGreen' : '鸟巢(水面)',
				'jinjiang' : '晋江',
				'all' : '点云',
				'srsb' : '萨尔茨堡',
				'T8H_NoLod' : 'BIM(8号楼)',
				'srsb_etc' : '萨尔茨堡（android）',
				'srsb_pvr' : '萨尔茨堡（IOS）',
				'image' : '珠峰影像',
				'info' : '珠峰地形',
				'canbarra' : '堪培拉',
				'sci_park' : '香港科技园',
				'NewConfig' : '耶路撒冷',
				'siguniang' : '四姑娘山',
				'zf_pc' : '珠峰',
				'zf_ios' : '珠峰(IOS)',
				'zf_android' : '珠峰(Android)',
				'CBD_ALL' : 'CBD',
				'鸟巢五期' : '鸟巢',
				'jinshanling_pvr' : '金山岭',
				'水面@vector' : '萨尔茨堡(水面)',
				'萨尔茨堡_居民区' : '萨尔茨堡_圣安德烈教堂',
				'萨尔茨堡_学校' : '萨尔茨堡_莱希勒公园'
			},
			ignore3DServices : {
				'3D-ChinaProvinces/rest' : true,
				'3D-Pipe3D/rest' : true,
				'3D-osgb/rest' : true,
				'3D-sample/rest' : true,
				'3D-zhufeng/rest' : true,
				'3D-S3MData/rest' : true,
				'3D-jinjiang/rest' : true,
				'3D-saercibao_dantihua_etc/rest' : true,
				'3D-Demo1/rest' : true,
				'3D-SiChuan/rest' : true,
				'3D-CBD_ALL/rest' : true,
				'3D-CBD/rest' : true,
				'3D-WebGLOlympicGreen/rest' : true,
				'3D-zf_tin_image_z/rest' : true,
				'3D-zhufeng/rest' : true,
                '3D-yanmofenxi/rest' : true,
                '3D-HuanJingJianCe/rest' : true,
                '3D-saercibao_dantihua_etc/rest' : true,
                '3D-saercibao_dantihua_pvr/rest' : true,
                '3D-saercibao_dantihua_pvr2/rest'  : true,
                '3D-test/rest' : true,
                '3D-stk_terrain/rest' : true,
                '3D-CBD/rest' : true
			},
			mobileIgnoreServices : {
				'3D-compress/rest' : true,
				'3D-canbarra/rest' : true,
				'3D-zf_pc/rest' : true
			},
			pcIgnoreServices : {
			},
			NOT : {
				'3D-srsb_etc/rest' : true,
				'3D-zf_android/rest' : true,
				'3D-srsb_pvr/rest' : true,
				'3D-zf_ios/rest' : true
			},
			ETC : {
				'3D-srsb_etc/rest' : true,
				'3D-zf_android/rest' : true,
				'3D-srsb/rest' : true
			},
			PVR : {
				'3D-srsb_pvr/rest' : true,
				'3D-zf_ios/rest' : true,
				'3D-srsb/rest' : true
			},
			SORT_RULE : {
				'萨尔茨堡_火车站' : SORT_NUM++,
				'萨尔茨堡_学校' : SORT_NUM++,
				'萨尔茨堡_居民区' : SORT_NUM++,
				'萨尔茨堡_足球场' : SORT_NUM++,
				'堪培拉_雷吉斯酒店' : SORT_NUM++,
				'堪培拉_国际会议中心' : SORT_NUM++,
				'堪培拉_克莱门斯街' : SORT_NUM++,
				'堪培拉_国会大厦' : SORT_NUM++,
				'Waters@OlympicGreen' : SORT_NUM++,
				'Tree@新CBD' : SORT_NUM++,
				'scipark' : SORT_NUM++,
				'srsb' : SORT_NUM++,
				'siguniang' : SORT_NUM++,
				'T8H_NoLod' : SORT_NUM++,
				'all' : SORT_NUM++,
				'水面@vector' : SORT_NUM++,
				'srsb_etc' : SORT_NUM++,
				'srsb_pvr' : SORT_NUM++
			},
			CAMERA_PARAM : {
				//香港科技园
				'sci_park' : {
					Cartesian3 : {x : -2419369.6792697683 ,y : 5379978.187041689,z : 2417696.1157676256},
					heading : 5.959162022803151,
					pitch:	 -0.21874043660391096,
					roll:	 6.282414349486778
				},
				//萨尔茨堡
				'srsb' : {
					Cartesian3 : {x : 4180954.5891797305 ,y : 968557.1382991979,z : 4703248.613417386},
					heading : 0.4262800548689478,
					pitch:	 -0.5686124899526832,
					roll:	 0.0016437843761494264
				},
				//萨尔茨堡(水面)
				'水面@vector' : {
					Cartesian3 : {x : 4180954.5891797305 ,y : 968557.1382991979,z : 4703248.613417386},
					heading : 0.4262800548689478,
					pitch:	 -0.5686124899526832,
					roll:	 0.0016437843761494264
				},
				//萨尔茨堡(ETC)
				'srsb_etc' : {
					Cartesian3 : {x : 4180954.5891797305 ,y : 968557.1382991979,z : 4703248.613417386},
					heading : 0.4262800548689478,
					pitch:	 -0.5686124899526832,
					roll:	 0.0016437843761494264
				},
				//萨尔茨堡(pvr)
				'srsb_pvr' : {
					Cartesian3 : {x : 4180954.5891797305 ,y : 968557.1382991979,z : 4703248.613417386},
					heading : 0.4262800548689478,
					pitch:	 -0.5686124899526832,
					roll:	 0.0016437843761494264
				},
				//鸟巢
				'鸟巢五期' : {
					Cartesian3 : {x : -2175569.386789459 ,y : 4383585.396721729,z : 4077036.9295460964},
					heading : 5.405511650847078,
					pitch:	 -0.2782764429991025,
					roll:	 6.2805394375165875
				},
				//鸟巢(水面)
				'Waters@OlympicGreen' : {
					Cartesian3 : {x : -2175569.386789459 ,y : 4383585.396721729,z : 4077036.9295460964},
					heading : 5.405511650847078,
					pitch:	 -0.2782764429991025,
					roll:	 6.2805394375165875
				},
				//CBD
				'CBD_ALL' : {
					Cartesian3 : {x : -2182429.699763085 ,y : 4386918.919955989,z : 4069992.320381068},
					heading : 0.2166238198765047,
					pitch:	 -0.24120620140647842,
					roll:	 0.0007317747020580967
				},
				//四姑娘山
				'siguniang' : {
					Cartesian3 : {x : -1225686.562964169 ,y : 5367543.24550225,z : 3236365.1885518613},
					heading : 0.14741634449855034,
					pitch:	 -0.26799190603237255,
					roll:	 0.00044806356456117413
				},
				//堪培拉
				'canbarra' : {
					Cartesian3 : {x : -4472300.319182013 ,y : 2674538.734087207,z : -3666745.21609297},
					heading : 0.6147568962211087,
					pitch:	 -0.16199091766244678,
					roll:	 6.28133657493342
				},
				//耶路撒冷
				'NewConfig' : {
					Cartesian3 : {x : 4433485.716964715 ,y : 3131450.5078776213,z : 3339861.830419633},
					heading : 0.40816026003937633,
					pitch:	 -0.3271668038422024,
					roll:	 0.0012596818725665315
				},
				//点云
				'all' : {
					Cartesian3 : {x : -2108798.002867941 ,y : 6019480.504550814,z : 44700.842716371706},
					heading : 5.991951726241681,
					pitch:	 -0.3351374215115477,
					roll:	 6.2831709464466385
				},
				//CBD 树木
				'Tree@新CBD' : {
					Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					heading : 6.254792092438359,
                    pitch : -0.2791200772288047,
                    roll : 6.2830876595991825
				},
				//CBD 地面
				'Ground_1@新CBD' : {
					Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					heading : 6.254792092438359,
                    pitch : -0.2791200772288047,
                    roll : 6.2830876595991825
				},
				//CBD 地面
				'Ground_2@新CBD' : {
					Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					heading : 6.254792092438359,
                    pitch : -0.2791200772288047,
                    roll : 6.2830876595991825
				},
				//CBD 建筑
				'Building@新CBD' : {
					Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					heading : 6.254792092438359,
                    pitch : -0.2791200772288047,
                    roll : 6.2830876595991825
				},
				//CBD 水面
				'shuimian@新CBD' : {
					Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					heading : 6.254792092438359,
                    pitch : -0.2791200772288047,
                    roll : 6.2830876595991825
				},
				//金山岭
				'jinshanling_pvr' : {
					Cartesian3 : {x : -2215478.4573752377,y : 4307079.474024054,z : 4137530.591334239},
                    heading : 6.088190006876596,
                    pitch : -0.32103956770335595,
                    roll : 6.282506865622235
				},
				'萨尔茨堡_足球场' : {
					Cartesian3 : {x : 4180278.2148029194,y :967993.6502662017,z : 4703813.6935041845},
					heading : 6.148313530025438,
                    pitch : -0.3812143414395608,
                    roll : 6.282700348146928
				},
				'萨尔茨堡_学校' : {
					Cartesian3 : {x : 4180901.0771870865,y :969263.9831018472,z : 4703066.826860772},
					heading : 6.1266392108517715,
                    pitch : -0.41525607844399914,
                    roll : 6.282614801674004
				},
				'萨尔茨堡_居民区' : {
					Cartesian3 : {x : 4181402.0475378884,y : 968794.1079814215,z : 4702723.118253315},
					heading : 5.872863120697554,
                    pitch : -0.46308100144695485,
                    roll : 6.281692305234037
				},
				'萨尔茨堡_火车站' : {
					Cartesian3 : {x : 4180777.7742772927,y : 969006.6357376062,z : 4703351.892056749},
					heading : 4.956726718713002,
                    pitch : -0.4352259507961289,
                    roll : 6.2796064011613915
				},
				'堪培拉_国会大厦' : {
					Cartesian3 : {x : -4472548.54454082,y : 2674432.6112516825,z : -3666400.432541532},
					heading : 0.6007335488202488,
                    pitch : -0.2744137349434217,
                    roll : 6.2813283490876675
				},
				'堪培拉_国际会议中心' : {
					Cartesian3 : {x : -4474484.9721811665,y : 2674131.6553716026,z : -3664258.2236266946},
					heading : 5.8447109085730276,
                    pitch : -0.3760697676759941,
                    roll : 0.001442461273298612
				},
				'堪培拉_雷吉斯酒店' : {
					Cartesian3 : {x : -4472708.283663221,y : 2673505.3594829114,z : -3666788.6338217887},
					heading : 4.821210330924696,
                    pitch : -0.38024549721568435,
                    roll : 0.003387600610346375
				},
				'堪培拉_克莱门斯街' : {
					Cartesian3 : {x : -4474324.849506137,y : 2674900.000487418,z : -3663942.8120619142},
					heading : 5.20332568710781,
                    pitch : -0.42628666459296594,
                    roll : 0.003062040548185152
				}
			}
	};
	return Config;
});

















