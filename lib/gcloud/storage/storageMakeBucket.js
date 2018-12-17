import { Storage } from "@google-cloud/storage"

export async function storageMakeBucket(options) {
  const { bucket, client, events, props, zone } = options

  const location = zone.replace(/-\w$/, "")

  if (client) {
    const storage = new Storage()

    try {
      await storage.createBucket(bucket, { location })
    } catch (e) {
      true
    }
  } else {
    await events.spawn([...props, "storageMakeBucket"], {
      args: [
        "mb",
        "-c",
        "regional",
        "-l",
        location,
        `gs://${bucket}`,
      ],
      command: "gsutil",
      lax: true,
    })
  }
}
