export async function clusterList({
  event,
  events,
  props,
}) {
  const { out } = await events.spawn(
    [...props, "clusterList"],
    {
      args: [
        "container",
        "clusters",
        "list",
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
