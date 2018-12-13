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
