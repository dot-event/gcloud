export async function pgImport(options) {
  const {
    bucket,
    dbId,
    events,
    fromPgId,
    lax,
    pgId,
    project,
    props,
  } = options

  const src = `gs://${bucket}/${fromPgId}.gz`

  const instance = await events.gcloudPgDescribe(props, {
    pgId,
  })

  await events.gcloudStorageAcl(props, {
    dest: `gs://${bucket}`,
    flag: "W",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  await events.gcloudStorageAcl(props, {
    dest: src,
    flag: "R",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  await events.spawn([...props, "sqlImport"], {
    args: [
      "sql",
      "import",
      "sql",
      pgId,
      src,
      `--database=${dbId}`,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    lax,
    silent: false,
  })
}
