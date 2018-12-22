export async function pgDescribe(options) {
  const { event, events, pgId, props } = options

  const { gcloudConfig } = events.get(props)
  const { pg } = gcloudConfig

  const { out } = await events.spawn(
    [...props, "pgDescribe"],
    {
      args: [
        "sql",
        "instances",
        "describe",
        pgId,
        "--format=json",
        `--project=${pg[pgId].project}`,
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
