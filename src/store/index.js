import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";
import { deepClone, tryJSONParse, tryReadUnknown } from "@/utils/globalMethod";
import Vue from "vue";

Vue.use(Vuex)

// 自动获取modules下的*.js
const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const cloneModules = deepClone(modules);

//持久化（关闭浏览器仍保留数据）
const plugins = navigator.cookieEnabled
  ? [
      //登录信息
      createPersistedState({
        key: `LOGIN`,
        storage: window.localStorage,
        reducer: (val) => ({ login: val.login }),
      }),
      createPersistedState({
        key: `TOKEN`,
        storage: {
          getItem: (key) => Cookies.get(key),
          setItem: (key, value) => {
            Cookies.set(key, value, {
              expires: tryReadUnknown(
                tryJSONParse(window.localStorage.getItem(`LOGIN`)),
                ".info.rememberMe"
              )
                ? 14
                : 1,
            });
            Cookies.set(
              "token",
              tryReadUnknown(tryJSONParse(value), ".token.token"),
              {
                expires: tryReadUnknown(
                  tryJSONParse(window.localStorage.getItem(`LOGIN`)),
                  ".info.rememberMe"
                )
                  ? 14
                  : 1,
              }
            );
          },
          removeItem: (key) => {
            Cookies.remove(key);
            Cookies.remove("token");
          },
        },
        reducer: (val) => ({ token: val.token }),
      }),
    ]
  : [];

// 重置vuex
export const resetStore = () => {
  for (let module in store.state) {
    for (let key in store.state[module]) {
      store.state[module][key] = deepClone(cloneModules[module].state[key]);
    }
  }
};

const store = new Vuex.Store({
  modules,
  plugins,
});

export default store;
