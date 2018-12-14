export async function pgDelete(options) {
  const { events, pgId, project, props, zone } = options

  await events.spawn([...props, "pgDelete", pgId], {
    args: [
      "sql",
      "instances",
      "delete",
      pgId,
      `--project=${project}`,
      `--zone=${zone}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
