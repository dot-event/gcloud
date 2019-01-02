export async function snapshotsList(options) {
  const { event, events, props } = options

  const { gcloudConfig } = events.get(props)
  const { projects } = gcloudConfig

  let list = []

  for (const project of projects) {
    const { out } = await events.spawn(
      [...props, "pgSnapshotsList", project],
      {
        args: [
          "compute",
          "snapshots",
          "list",
          `--project=${project}`,
          "--format=json",
          "--sort-by=~creationTimestamp",
        ],
        command: "gcloud",
        json: true,
      }
    )

    list = list.concat(out)
  }

  await events.set([...props, "snapshotsList", "all"], list)

  event.signal.returnValue = list
}
