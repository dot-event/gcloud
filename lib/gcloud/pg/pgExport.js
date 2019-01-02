export async function pgExport(options) {
  const {
    bucket,
    dbId,
    events,
    pgId,
    project,
    props,
  } = options

  const instance = await events.gcloudPgDescribe(props, {
    pgId,
  })

  await events.gcloudStorageMakeBucket(props, {
    bucket,
    zone: instance.region,
  })

  await events.gcloudStorageAcl(props, {
    dest: `gs://${bucket}`,
    flag: "W",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  const src = `gs://${bucket}/${pgId}.gz`
  const timestamp = new Date().toISOString()

  await events.spawn([...props, "sqlExport"], {
    args: [
      "sql",
      "export",
      "sql",
      pgId,
      src,
      `--database=${dbId}`,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })

  await events.gcloudStorageCopy(props, {
    bucket,
    dest: `${timestamp}-${pgId}.gz`,
    src,
  })
}
