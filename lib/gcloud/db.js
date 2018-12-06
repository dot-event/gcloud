export async function dbCreate(options) {
  const { dbId, events, pgId, project, props } = options

  await events.spawn([...props, dbId], {
    args: [
      "sql",
      "databases",
      "create",
      dbId,
      `--project=${project}`,
      `--instance=${pgId}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}

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
