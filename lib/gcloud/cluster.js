export async function clusterCreate(options) {
  const {
    clusterId,
    events,
    numNodes,
    project,
    props,
    zone,
  } = options

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
      ],
      command: "gcloud",
      silent: false,
    }
  )
}

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

export async function clusterList({
  event,
  events,
  props,
}) {
  const { out } = await events.spawn(
    [...props, "clusterList"],
    {
      args: [
        "container",
        "clusters",
        "list",
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
