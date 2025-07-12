/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/index.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import { publicPath } from "@/config";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue"),
    hidden: true,
  },
  {
    path: "/401",
    name: "401",
    component: () => import("@/views/401.vue"),
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index/index.vue"),
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/external-job",
    component: Layout,
    meta: {
      title: "",
      icon: "",
    },
    children: [
      {
        path: "https://job.vuejs-core.cn/posts",
        meta: {
          title: "找工作",
          target: "_blank",
          icon: "horse-head",
          badge: "New",
        },
      },
    ],
  },
  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */

  {
    path: "/vab",
    component: Layout,
    redirect: "noRedirect",
    name: "Vab",
    alwaysShow: true,
    meta: { title: "组件", icon: "box-open" },
    children: [
      {
        path: "vue3Demo",
        name: "Vue3Demo",
        component: () => import("@/views/vab/vue3Demo/index.vue"),
        meta: {
          title: "Vue 3 示例",
          permissions: ["admin"],
        },
      },
      {
        path: "permissions",
        name: "Permission",
        component: () => import("@/views/vab/permissions/index"),
        meta: {
          title: "角色权限",
          permissions: ["admin", "editor"],
        },
      },
      {
        path: "icon",
        component: EmptyLayout,
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
            component: () => import("@/views/vab/icon/index"),
            meta: { title: "常规图标" },
          },
        ],
      },
      {
        path: "table",
        component: () => import("@/views/vab/table/index"),
        name: "Table",
        meta: {
          title: "表格",
          permissions: ["admin"],
        },
      },

      {
        path: "webSocket",
        name: "WebSocket",
        component: () => import("@/views/vab/webSocket/index"),
        meta: { title: "webSocket", permissions: ["admin"] },
      },
      {
        path: "form",
        name: "Form",
        component: () => import("@/views/vab/form/index"),
        meta: { title: "表单", permissions: ["admin"] },
      },
      {
        path: "element",
        name: "Element",
        component: () => import("@/views/vab/element/index"),
        meta: { title: "常用组件", permissions: ["admin"] },
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/vab/tree/index"),
        meta: { title: "树", permissions: ["admin"] },
      },
      {
        path: "menu1",
        component: () => import("@/views/vab/nested/menu1/index"),
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
            component: () => import("@/views/vab/nested/menu1/menu1-1/index"),

            children: [
              {
                path: "menu1-1-1",
                name: "Menu1-1-1",
                meta: { title: "嵌套路由 1-1-1" },
                component: () =>
                  import("@/views/vab/nested/menu1/menu1-1/menu1-1-1/index"),
              },
            ],
          },
        ],
      },
      {
        path: "loading",
        name: "Loading",
        component: () => import("@/views/vab/loading/index"),
        meta: { title: "loading", permissions: ["admin"] },
      },
      {
        path: "backToTop",
        name: "BackToTop",
        component: () => import("@/views/vab/backToTop/index"),
        meta: { title: "返回顶部", permissions: ["admin"] },
      },
      {
        path: "lodash",
        name: "Lodash",
        component: () => import("@/views/vab/lodash/index"),
        meta: { title: "lodash", permissions: ["admin"] },
      },
      {
        path: "log",
        name: "Log",
        component: () => import("@/views/vab/errorLog/index"),
        meta: { title: "错误日志模拟", permissions: ["admin"] },
      },
      {
        path: "external-link",
        component: EmptyLayout,
        redirect: "noRedirect",
        meta: {
          title: "外链",
        },
        children: [
          {
            path: "https://github.com/zxwk1998/vue-admin-better/",
            name: "ExternalLink",
            meta: {
              title: "外链",
              target: "_blank",
              permissions: ["admin", "editor"],
              badge: "New",
            },
          },
        ],
      },
      {
        path: "more",
        name: "More",
        component: () => import("@/views/vab/more/index"),
        meta: { title: "关于", permissions: ["admin"] },
      },
    ],
  },
  {
    path: "/error",
    component: EmptyLayout,
    redirect: "noRedirect",
    name: "Error",
    meta: { title: "错误页", icon: "bug" },
    children: [
      {
        path: "401",
        name: "Error401",
        component: () => import("@/views/401"),
        meta: { title: "401" },
      },
      {
        path: "404",
        name: "Error404",
        component: () => import("@/views/404"),
        meta: { title: "404" },
      },
    ],
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(publicPath),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export function resetRouter() {
  // 注意：所有动态路由路由必须带有name属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name } = route;
      if (name && name !== "Login") {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch (error) {
    // 强制刷新浏览器，不要用这种方式
    window.location.reload();
  }
}

export default router;
