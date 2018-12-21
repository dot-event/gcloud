export async function pgList(options) {
  const { event, events, props } = options

  const { gcloudConfig } = events.get(props)
  const { projects } = gcloudConfig

  let list = []

  for (const project of projects) {
    const { out } = await events.spawn(
      [...props, "pgList", project],
      {
        args: [
          "sql",
          "instances",
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

  await events.set([...props, "pgList", "all"], list)

  event.signal.returnValue = list
}
