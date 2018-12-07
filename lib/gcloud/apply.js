// Helpers
export async function apply(options) {
  await applyCluster(options)
  await applyPg(options)
}

async function applyCluster(options) {
  const { events, onlyCluster } = options
  const props = [...options.props, "applyCluster"]

  const { clusters } = await events.gcloudReadConfig(
    options.props
  )

  const clusterList = await events.gcloudClusterList(props)
  const clusterIds = clusterList.map(({ name }) => name)

  for (const cluster of clusterList) {
    const { name: clusterId, project } = cluster

    if (onlyCluster && onlyCluster !== clusterId) {
      continue
    }

    if (clusters[clusterId]) {
      continue
    }

    await events.clusterDelete(props, {
      clusterId,
      project,
    })
  }

  for (const clusterId in clusters) {
    if (onlyCluster && onlyCluster !== clusterId) {
      continue
    }

    if (clusterIds.indexOf(clusterId) > -1) {
      continue
    }

    const { numNodes, project, zone } = clusters[clusterId]

    await events.gcloudClusterCreate(props, {
      clusterId,
      numNodes,
      project,
      zone,
    })
  }
}

export async function applyPg(options) {
  const { events, onlyPg } = options
  const props = [...options.props, "applyPg"]

  const { pg } = await events.gcloudReadConfig(
    options.props
  )

  const pgList = await events.gcloudPgList(props)
  const pgIds = pgList.map(({ name }) => name)

  for (const pgInstance of pgList) {
    const { name: pgId, project } = pgInstance

    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    if (!pg.instances[pgId]) {
      await events.gcloudPgDelete(props, { pgId, project })
    }
  }

  for (const pgId in pg.instances) {
    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    const { cpu, memory, project, zone } = pg.instances[
      pgId
    ]

    if (pgIds.indexOf(pgId) === -1) {
      await events.gcloudPgCreate(props, {
        cpu,
        memory,
        pgId,
        project,
        zone,
      })
    }

    const dbList = await events.gcloudDbList(props)
    const dbIds = dbList.map(({ name }) => name)

    for (const dbId of pg.dbs) {
      if (dbIds.indexOf(dbId) > -1) {
        continue
      }

      await events.gcloudDbCreate(props, {
        dbId,
        pgId,
        project,
      })
    }
  }
}
