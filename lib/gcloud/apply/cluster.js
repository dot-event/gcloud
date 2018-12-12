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
  const { events, force, onlyCluster, props } = options

  const { clusterList, gcloudConfig } = clusterConfig(
    options
  )

  const { clusters } = gcloudConfig

  for (const cluster of clusterList) {
    const { name: clusterId, selfLink } = cluster
    const project = selfLink.match(/projects\/([^/]+)/)[1]

    if (onlyCluster && onlyCluster !== clusterId) {
      continue
    }

    if (clusters && clusters[clusterId]) {
      continue
    }

    if (!force) {
      await events.status(props, {
        fail: true,
        highlight: true,
        msg: ["add --force to delete cluster:", clusterId],
        op: "gcloud",
      })
      process.exit(1)
    }

    await events.gcloudClusterDelete(props, {
      clusterId,
      project,
    })
  }
}

function clusterConfig(options) {
  const { events, props } = options

  const { gcloudConfig } = events.get(props)

  const clusterList = events.get([
    ...props,
    "clusterList",
    "out",
  ])

  const clusterIds = clusterList.map(({ name }) => name)

  return { clusterIds, clusterList, gcloudConfig }
}
