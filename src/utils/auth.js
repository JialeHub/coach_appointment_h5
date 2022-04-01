import store from "@/store";
import { RSAEncrypt } from "@/utils/cryptology";
import { getUserInfoApi, initMenuApi, loginApi, logoutApi } from "@/api";
import { notEmpty } from "@/utils/globalMethod";

/**
 * @param form
 * @return {Promise}
 * @description 登录
 * */
export async function login(form) {
  await logout();
  let data = { ...form };
  data["password"] = RSAEncrypt(form["password"]);
  delete data.showPass;
  return new Promise((resolve, reject) => {
    loginApi(data)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await store.dispatch("setRememberMe", {
            rememberMe: form.rememberMe,
            username: form.username,
          });
          await store.dispatch("setToken", res["token"]);
          // 登陆后直接刷新跳转进首页，那时候再拉取
          // await getUserInfoMenu().catch(err=>reject(err));
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        let serverError = notEmpty(err["data"]); //判断是否为网络错误
        if (!serverError) console.error(err); //打印非网络错误
        let res = serverError ? err["data"] : {};
        res["errorType"] = "error";
        reject(res);
      });
  });
}

/**
 * @return {Promise}
 * @description 拉取菜单
 * */
export function initMenu() {
  return new Promise((resolve, reject) => {
    if (notEmpty(store.getters.token)) {
      initMenuApi()
        .then((res) => {
          if (!(res.status === 200 || res.status === 201)) reject(res);
          resolve()
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    } else {
      resolve("请先登录！");
    }
  });
}

/**
 * @return {Promise}
 * @description 获取个人信息和菜单
 * */
export async function getUserInfoMenu() {
  return new Promise((resolve, reject) => {
    getUserInfo()
      .then((res1) => {
        initMenu()
          .then((res2) => resolve([res1, res2]))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

/**
 * @return {Promise}
 * @description 获取个人信息
 * */
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    if (notEmpty(store.getters.token)) {
      getUserInfoApi()
        .then(async (res) => {
          if (res.status === 200) {
            await store.dispatch("setUser", res["info"]);
            resolve(res["info"]);
          } else {
            reject(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve("请先登录！");
    }
  });
}

/**
 * @return {Promise}
 * @description 注销
 * */
export async function logout() {
  if (notEmpty(store.getters.token)) await logoutApi({}).catch((err) => err);
  await Promise.all([
    store.dispatch("setToken", ""),
    store.dispatch("setUser", {}),
  ]);
}
