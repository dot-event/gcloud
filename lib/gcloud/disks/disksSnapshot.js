export async function disksSnapshot(options) {
  const { diskName, events, project, props, zone } = options

  await events.spawn(
    [...props, "disksSnapshot", diskName],
    {
      args: [
        "compute",
        "disks",
        "snapshot",
        diskName,
        `--project=${project}`,
        `--zone=${zone}`,
        "--quiet",
      ],
      command: "gcloud",
      silent: false,
    }
  )
}
