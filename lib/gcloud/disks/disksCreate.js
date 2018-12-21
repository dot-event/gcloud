export async function disksCreate(options) {
  const {
    clusterId,
    diskName,
    events,
    project,
    props,
    size,
    zone,
  } = options

  await events.spawn([...props, "disksCreate", clusterId], {
    args: [
      "compute",
      "disks",
      "create",
      diskName,
      `--project=${project}`,
      `--size=${size}`,
      `--zone=${zone}`,
    ],
    command: "gcloud",
    silent: false,
  })
}
