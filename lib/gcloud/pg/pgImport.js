import { basename } from "path"
import os from "os"

export async function pgImport(options) {
  const {
    bucket,
    cwd,
    db,
    glob,
    events,
    pgId,
    props,
  } = options

  const paths = await events.glob(props, {
    pattern: glob.replace(/^~/, os.homedir()),
  })

  const path = paths.reverse().find(p => p.indexOf(db) > -1)
  const dumpPath = `${cwd}/dump`
  const dumpSqlPath = `${dumpPath}/${db}.sql`

  await events.spawn([...props, "pgImportSed"], {
    args: [
      "-c",
      `mkdir -p ${dumpPath}; \
      cat ${path} | \
      sed -E 's/(DROP|CREATE|COMMENT ON) EXTENSION/-- \\1 EXTENSION/g' > \
      ${dumpSqlPath}`,
    ],
    command: "sh",
  })

  const instance = await events.gcloudPgDescribe(props, {
    pgId,
  })

  await events.gcloudStorageMakeBucket(props, {
    bucket,
    zone: instance.region,
  })

  await events.gcloudStorageCopy(props, {
    dest: bucket,
    src: dumpSqlPath,
  })

  await events.gcloudStorageAcl(props, {
    dest: bucket,
    flag: "W",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  await events.gcloudStorageAcl(props, {
    dest: `${bucket}/${basename(dumpSqlPath)}`,
    flag: "R",
    serviceAccount: instance.serviceAccountEmailAddress,
  })

  await events.spawn([...props, "sqlImport"], {
    args: [
      "sql",
      "import",
      "sql",
      pgId,
      `gs://${bucket}/${basename(dumpSqlPath)}`,
      `--database=${db}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}
