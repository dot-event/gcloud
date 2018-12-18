export async function disksCreate(options) {
  const {
    clusterId,
    diskName,
    events,
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
      `--size=${size}`,
      `--zone=${zone}`,
    ],
    command: "gcloud",
    silent: false,
  })
}
