export default {
  apiRoot: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8080" : "https://www.jb.adamtiz.zone/api",
  sessionStorageApiTokenKeyName: "jobs-board-api-token",
};
