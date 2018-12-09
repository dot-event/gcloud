export async function pgDelete(options) {
  const { events, pgId, project, props } = options

  await events.spawn([...props, "pgDelete", pgId], {
    args: [
      "sql",
      "instances",
      "delete",
      pgId,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
