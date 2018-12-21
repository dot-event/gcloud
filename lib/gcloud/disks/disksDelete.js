export async function disksDelete(options) {
  const {
    diskName,
    events,
    lax,
    project,
    props,
    zone,
  } = options

  await events.spawn([...props, "disksDelete", diskName], {
    args: [
      "compute",
      "disks",
      "delete",
      diskName,
      `--project=${project}`,
      `--zone=${zone}`,
      "--quiet",
    ],
    command: "gcloud",
    lax,
    silent: false,
  })
}
