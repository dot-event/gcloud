import { Storage } from "@google-cloud/storage"

export async function storageCopy(options) {
  const {
    bucket: bucketName,
    client,
    dest,
    events,
    props,
    src,
  } = options

  if (client) {
    const storage = new Storage()
    const bucket = storage.bucket(bucketName)

    const options = dest
      ? { destination: bucket.file(dest) }
      : undefined

    await bucket.upload(src, options)
  } else {
    await events.spawn([...props, "storageCopy"], {
      args: [
        "cp",
        src,
        `gs://${bucketName}${dest ? `/${dest}` : ""}`,
      ],
      command: "gsutil",
    })
  }
}
