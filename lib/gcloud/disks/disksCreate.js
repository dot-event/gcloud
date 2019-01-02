export async function disksCreate(options) {
  const {
    clusterId,
    diskName,
    events,
    project,
    props,
    size,
    snapshot,
    zone,
  } = options

  const snapshotOptions = snapshot
    ? [`--source-snapshot=${snapshot}`]
    : []

  await events.spawn([...props, "disksCreate", clusterId], {
    args: [
      "compute",
      "disks",
      "create",
      diskName,
      `--project=${project}`,
      `--size=${size}`,
      `--zone=${zone}`,
      ...snapshotOptions,
    ],
    command: "gcloud",
    silent: false,
  })
}
