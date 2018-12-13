export async function dbList(options) {
  const { event, events, pgId, props } = options

  const { out } = await events.spawn(
    [...props, "dbList", pgId],
    {
      args: [
        "sql",
        "databases",
        "list",
        `--instance=${pgId}`,
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
