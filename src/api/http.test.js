/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { createHttp, handleFileDownload } from "./http";

// mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value + ""; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("createHttp", () => {
  let http, mock;

  beforeEach(() => {
    http = createHttp({ baseURL: "/api" });
    mock = new MockAdapter(http.instance);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
    vi.restoreAllMocks();
  });

  it("GET 请求正常返回数据", async () => {
    mock.onGet("/test", { params: { a: 1 } }).reply(200, { code: 0, data: 123 });
    const res = await http.get("/test", { a: 1 });
    expect(res).toEqual({ code: 0, data: 123 });
  });

  it("POST 请求正常返回数据", async () => {
    mock.onPost("/test", { foo: "bar" }).reply(200, { ok: true });
    const res = await http.post("/test", { foo: "bar" });
    expect(res).toEqual({ ok: true });
  });

  it("PUT 请求正常返回数据", async () => {
    mock.onPut("/test", { foo: "bar" }).reply(200, { ok: true });
    const res = await http.put("/test", { foo: "bar" });
    expect(res).toEqual({ ok: true });
  });

  it("DELETE 请求正常返回数据", async () => {
    mock.onDelete("/test", { params: { id: 1 } }).reply(200, { ok: true });
    const res = await http.delete("/test", { id: 1 });
    expect(res).toEqual({ ok: true });
  });

  it("自动注入 token", async () => {
    localStorage.setItem("token", "abc123");
    mock.onGet("/token").reply((config) => {
      expect(config.headers.Authorization).toBe("Bearer abc123");
      return [200, { ok: true }];
    });
    const res = await http.get("/token");
    expect(res).toEqual({ ok: true });
  });

  it("响应拦截：普通数据直接返回", async () => {
    mock.onGet("/data").reply(200, { hello: "world" });
    const res = await http.get("/data");
    expect(res).toEqual({ hello: "world" });
  });

  it("响应拦截：文件流自动下载", async () => {
    const blob = new Blob(["test"]);
    const spy = vi.spyOn(window, "Blob").mockImplementation(() => blob);
    const downloadSpy = vi.spyOn({ handleFileDownload }, "handleFileDownload").mockReturnValue("file.txt");

    mock.onGet("/file").reply(200, blob, {
      "content-type": "application/octet-stream",
      "content-disposition": 'attachment; filename="file.txt"'
    });

    const res = await http.get("/file", {}, { responseType: "blob" });
    expect(downloadSpy).toHaveBeenCalled();
    expect(res).toEqual({ downloaded: true, filename: "file.txt" });

    spy.mockRestore();
    downloadSpy.mockRestore();
  });

  it("响应拦截：文件流但实际为 json 错误", async () => {
    const errorJson = { message: "出错了" };
    const blob = new Blob([JSON.stringify(errorJson)], { type: "application/json" });
    blob.text = () => Promise.resolve(JSON.stringify(errorJson)); // mock text 方法

    mock.onGet("/file").reply(200, blob, {
      "content-type": "application/json"
    });

    await expect(http.get("/file", {}, { responseType: "blob" })).rejects.toEqual(errorJson);
  });

  it("响应拦截：网络异常", async () => {
    mock.onGet("/err").networkError();
    await expect(http.get("/err")).rejects.toBeTruthy();
  });

  it("响应拦截：服务端返回错误", async () => {
    mock.onGet("/fail").reply(500, { message: "服务端错误" });
    await expect(http.get("/fail")).rejects.toBeTruthy();
  });
});
