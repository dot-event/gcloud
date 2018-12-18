export async function clusterDelete(options) {
  const {
    clusterId,
    events,
    props,
    project,
    zone,
  } = options

  await events.spawn(
    [...props, "clusterDelete", clusterId],
    {
      args: [
        "container",
        "clusters",
        "delete",
        clusterId,
        `--project=${project}`,
        `--zone=${zone}`,
        "--quiet",
      ],
      command: "gcloud",
      silent: false,
    }
  )
}
