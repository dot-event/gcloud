export async function pgImport(options) {
  const {
    bucket,
    dbId,
    events,
    fromPgId,
    pgId,
    project,
    props,
  } = options

  await events.spawn([...props, "sqlImport"], {
    args: [
      "sql",
      "import",
      "sql",
      pgId,
      `gs://${bucket}/${fromPgId}.gz`,
      `--database=${dbId}`,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
