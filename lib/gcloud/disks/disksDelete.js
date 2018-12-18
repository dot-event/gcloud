export async function disksDelete(options) {
  const { diskName, events, lax, props, zone } = options

  await events.spawn([...props, "disksDelete", diskName], {
    args: [
      "compute",
      "disks",
      "delete",
      diskName,
      `--zone=${zone}`,
      "--quiet",
    ],
    command: "gcloud",
    lax,
    silent: false,
  })
}
