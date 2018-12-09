export async function pgCreate(options) {
  const {
    cpu,
    events,
    memory,
    pgId,
    project,
    props,
    zone,
  } = options

  await events.spawn([...props, "pgCreate", pgId], {
    args: [
      "beta",
      "sql",
      "instances",
      "create",
      pgId,
      `--project=${project}`,
      `--gce-zone=${zone}`,
      "--database-version=POSTGRES_9_6",
      `--cpu=${cpu}`,
      `--memory=${memory}`,
      "--network=default",
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
