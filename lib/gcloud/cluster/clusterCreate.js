export async function clusterCreate(options) {
  const {
    clusterId,
    events,
    numNodes,
    project,
    props,
    version,
    zone,
  } = options

  const versionArg = version
    ? [`--cluster-version=${version}`]
    : []

  await events.spawn(
    [...props, "clusterCreate", clusterId],
    {
      args: [
        "container",
        "clusters",
        "create",
        clusterId,
        `--project=${project}`,
        `--zone=${zone}`,
        `--num-nodes=${numNodes}`,
        "--enable-ip-alias",
        "--create-subnetwork",
        `name=${clusterId}-subnet`,
        ...versionArg,
      ],
      command: "gcloud",
      silent: false,
    }
  )
}
