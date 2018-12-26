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
    dest: bucket,
    flag: "W",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  await events.spawn([...props, "sqlExport"], {
    args: [
      "sql",
      "export",
      "sql",
      pgId,
      `gs://${bucket}/${pgId}.gz`,
      `--database=${dbId}`,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
