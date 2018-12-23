export async function applyCluster(options) {
  const { events, props } = options

  await events.gcloudClusterList(props)

  await clusterDelete(options)
  await clusterCreate(options)
}

async function clusterCreate(options) {
  const { events, onlyCluster, props } = options

  const { clusterIds, gcloudConfig } = clusterConfig(
    options
  )

  const { clusters } = gcloudConfig

  if (!clusters) {
    return
  }

  for (const clusterId in clusters) {
    if (onlyCluster && onlyCluster !== clusterId) {
      continue
    }

    if (clusterIds.indexOf(clusterId) > -1) {
      continue
    }

    await events.gcloudClusterCreate(props, {
      ...clusters[clusterId],
      clusterId,
    })
  }
}

async function clusterDelete(options) {
  const {
    events,
    forceCluster,
    onlyCluster,
    props,
  } = options

  const { clusterList, gcloudConfig } = clusterConfig(
    options
  )

  const { clusters } = gcloudConfig

  for (const cluster of clusterList) {
    const { name: clusterId, selfLink, zone } = cluster
    const project = selfLink.match(/projects\/([^/]+)/)[1]

    if (onlyCluster && onlyCluster !== clusterId) {
      continue
    }

    if (clusters && clusters[clusterId]) {
      continue
    }

    if (!forceCluster) {
      await events.status(props, {
        fail: true,
        highlight: true,
        msg: [
          "add --force-cluster to delete clusters like",
          clusterId,
          "BE CAREFUL!!!",
        ],
        op: "gcloud",
      })
      process.exit(1)
    }

    if (
      clusterId.indexOf("prod") === -1 ||
      forceCluster === "prod"
    ) {
      await events.gcloudClusterDelete(props, {
        clusterId,
        project,
        zone,
      })
    }
  }
}

function clusterConfig(options) {
  const { events, props } = options

  const { gcloudConfig } = events.get(props)

  const clusterList = events.get([
    ...props,
    "clusterList",
    "all",
  ])

  const clusterIds = clusterList.map(({ name }) => name)

  return { clusterIds, clusterList, gcloudConfig }
}
