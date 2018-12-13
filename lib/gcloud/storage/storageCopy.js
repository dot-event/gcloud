export async function storageCopy(options) {
  const { dest, events, props, src } = options

  await events.spawn([...props, "storageCopy"], {
    args: ["cp", src, `gs://${dest}`],
    command: "gsutil",
  })
}
