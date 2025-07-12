const data = [
  {
    path: "/",
    component: "Layout",
    redirect: "index",
    children: [
      {
        path: "index",
        name: "Index",
        component: "@/views/index/index",
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/vab",
    component: "Layout",
    redirect: "noRedirect",
    name: "Vab",
    alwaysShow: true,
    meta: { title: "组件", icon: "cloud" },
    children: [
      {
        path: "permissions",
        name: "Permission",
        component: "@/views/vab/permissions/index",
        meta: {
          title: "权限控制",
          permissions: ["admin", "editor"],
        },
      },
      {
        path: "icon",
        component: "EmptyLayout",
        redirect: "noRedirect",
        name: "Icon",
        meta: {
          title: "图标",
          permissions: ["admin"],
        },
        children: [
          {
            path: "awesomeIcon",
            name: "AwesomeIcon",
            component: "@/views/vab/icon/index",
            meta: { title: "常规图标" },
          },
          {
            path: "colorfulIcon",
            name: "ColorfulIcon",
            component: "@/views/vab/icon/colorfulIcon",
            meta: { title: "多彩图标" },
          },
        ],
      },
      {
        path: "table",
        component: "@/views/vab/table/index",
        name: "Table",
        meta: {
          title: "表格",
          permissions: ["admin"],
        },
      },
      {
        path: "webSocket",
        name: "WebSocket",
        component: "@/views/vab/webSocket/index",
        meta: { title: "webSocket", permissions: ["admin"] },
      },
      {
        path: "form",
        name: "Form",
        component: "@/views/vab/form/index",
        meta: { title: "表单", permissions: ["admin"] },
      },
      {
        path: "element",
        name: "Element",
        component: "@/views/vab/element/index",
        meta: { title: "常用组件", permissions: ["admin"] },
      },
      {
        path: "tree",
        name: "Tree",
        component: "@/views/vab/tree/index",
        meta: { title: "树", permissions: ["admin"] },
      },
      {
        path: "verify",
        name: "Verify",
        component: "@/views/vab/verify/index",
        meta: { title: "验证码", permissions: ["admin"] },
      },
      {
        path: "menu1",
        component: "@/views/vab/nested/menu1/index",
        name: "Menu1",
        alwaysShow: true,
        meta: {
          title: "嵌套路由 1",
          permissions: ["admin"],
        },
        children: [
          {
            path: "menu1-1",
            name: "Menu1-1",
            alwaysShow: true,
            meta: { title: "嵌套路由 1-1" },
            component: "@/views/vab/nested/menu1/menu1-1/index",

            children: [
              {
                path: "menu1-1-1",
                name: "Menu1-1-1",
                meta: { title: "嵌套路由 1-1-1" },
                component: "@/views/vab/nested/menu1/menu1-1/menu1-1-1/index",
              },
            ],
          },
        ],
      },
      {
        path: "loading",
        name: "Loading",
        component: "@/views/vab/loading/index",
        meta: { title: "loading", permissions: ["admin"] },
      },
      {
        path: "backToTop",
        name: "BackToTop",
        component: "@/views/vab/backToTop/index",
        meta: { title: "返回顶部", permissions: ["admin"] },
      },
      {
        path: "lodash",
        name: "Lodash",
        component: "@/views/vab/lodash/index",
        meta: { title: "lodash", permissions: ["admin"] },
      },
      {
        path: "log",
        name: "Log",
        component: "@/views/vab/errorLog/index",
        meta: { title: "错误日志模拟", permissions: ["admin"] },
      },
      {
        path: "more",
        name: "More",
        component: "@/views/vab/more/index",
        meta: { title: "关于", permissions: ["admin"] },
      },
    ],
  },
  {
    path: "/error",
    component: "EmptyLayout",
    redirect: "noRedirect",
    name: "Error",
    meta: { title: "错误页", icon: "bug" },
    children: [
      {
        path: "401",
        name: "Error401",
        component: "@/views/401",
        meta: { title: "401" },
      },
      {
        path: "404",
        name: "Error404",
        component: "@/views/404",
        meta: { title: "404" },
      },
    ],
  },
];
module.exports = [
  {
    url: "/menu/navigate",
    type: "post",
    response() {
      return { code: 200, msg: "success", data: data };
    },
  },
];
