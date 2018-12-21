export async function dbList(options) {
  const { event, events, pgId, project, props } = options

  const { out } = await events.spawn(
    [...props, "dbList", pgId, project],
    {
      args: [
        "sql",
        "databases",
        "list",
        `--instance=${pgId}`,
        `--project=${project}`,
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
