import { Storage } from "@google-cloud/storage"

export async function storageDownload(options) {
  const {
    bucket,
    client,
    dest,
    events,
    props,
    src,
  } = options

  if (client) {
    const storage = new Storage()
    await storage
      .bucket(bucket)
      .file(src)
      .download({ destination: dest })
  } else {
    await events.spawn([...props, "storageCopy"], {
      args: ["cp", `gs://${bucket}/${src}`, dest],
      command: "gsutil",
    })
  }
}
