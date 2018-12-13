export async function pgDescribe(options) {
  const { event, events, pgId, props } = options

  const { out } = await events.spawn(
    [...props, "pgDescribe"],
    {
      args: [
        "sql",
        "instances",
        "describe",
        pgId,
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
