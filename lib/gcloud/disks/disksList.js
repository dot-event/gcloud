export async function disksList({ event, events, props }) {
  const { gcloudConfig } = events.get(props)
  const { projects } = gcloudConfig

  let list = []

  for (const project of projects) {
    const { out } = await events.spawn(
      [...props, "disksList", project],
      {
        args: [
          "compute",
          "disks",
          "list",
          "--format=json",
          `--project=${project}`,
        ],
        command: "gcloud",
        json: true,
      }
    )

    list = list.concat(out)
  }

  await events.set([...props, "disksList", "all"], list)

  event.signal.returnValue = list
}
