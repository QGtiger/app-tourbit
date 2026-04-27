// import OSS from "ali-oss";

import { getAppConfig } from ".";

// const client = new OSS({
//   region: "oss-cn-beijing",
//   bucket: "lf-ipaas",
//   accessKeyId: process.env.OSS_ACCESS_KEYID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEYSECRECT!,
// });

// export async function uploadFile(file: File) {
//   // 生成唯一的文件名，避免中文文件名导致的编码问题
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 15);
//   const ext = file.name.split(".").pop() || "jpg";
//   const objectName = `uploads/${timestamp}_${random}.${ext}`;

//   // 对原始文件名进行编码，用于 Content-Disposition
//   const encodedFileName = encodeURIComponent(file.name);

//   return client
//     .put(objectName, file, {
//       headers: {
//         "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
//       },
//     })
//     .then((result) => result.url);
// }

export function jumpToLogin() {
  location.href = `${getAppConfig().LOGIN_URL}?redirect=${encodeURIComponent(
    location.href
  )}`;
}
