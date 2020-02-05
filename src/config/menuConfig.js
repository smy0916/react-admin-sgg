const MENU_LIST = [
	{
		title: "首页",
		icon: "home",
		to: "/home"
	},
	{
		title: "商品",
		icon: "appstore",
		to: "/products",
		children: [
			{
				title: "品类管理",
				icon: "unordered-list",
				to: "/category"
			},
			{
				title: "商品管理",
				icon: "tool",
				to: "/product"
			}
		]
	},
	{
		title: "用户管理",
		icon: "user",
		to: "/user"
	},
	{
		title: "角色管理",
		icon: "safety-certificate",
		to: "/role"
	},
	{
		title: "图形图表",
		icon: "area-chart",
		to: "/charts",
		children: [
			{
				title: "柱状图",
				icon: "bar-chart",
				to: "/charts/bar"
			},
			{
				title: "折线图",
				icon: "line-chart",
				to: "/charts/line"
			},
			{
				title: "饼图",
				icon: "pie-chart",
				to: "/charts/pie"
			}
		]
	}
]

export default MENU_LIST