export async function storageMakeBucket(options) {
  const { bucket, events, props, zone } = options

  const location = zone.replace(/-\w$/, "")

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
