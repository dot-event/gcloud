export async function clusterCreate(options) {
  const {
    clusterId,
    events,
    numNodes,
    machineType,
    project,
    props,
    version,
    zone,
  } = options

  const machineTypeArg = machineType
    ? [`--machine-type=${machineType}`]
    : []

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
        ...machineTypeArg,
        ...versionArg,
      ],
      command: "gcloud",
      silent: false,
    }
  )
}
