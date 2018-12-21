export async function pgUserList(options) {
  const { event, events, pgId, project, props } = options

  const { out } = await events.spawn(
    [...props, "pgUserList"],
    {
      args: [
        "sql",
        "users",
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
