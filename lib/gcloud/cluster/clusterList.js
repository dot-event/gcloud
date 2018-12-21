export async function clusterList({
  event,
  events,
  props,
}) {
  const { gcloudConfig } = events.get(props)
  const { projects } = gcloudConfig

  let list = []

  for (const project of projects) {
    const { out } = await events.spawn(
      [...props, "clusterList", project],
      {
        args: [
          "container",
          "clusters",
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

  await events.set([...props, "clusterList", "all"], list)

  event.signal.returnValue = list
}
