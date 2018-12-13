export async function dbDelete(options) {
  const { dbId, events, pgId, project, props } = options

  await events.spawn([...props, dbId], {
    args: [
      "sql",
      "databases",
      "delete",
      dbId,
      `--project=${project}`,
      `--instance=${pgId}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
