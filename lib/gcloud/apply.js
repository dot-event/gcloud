// Packages
import generatePassword from "password-generator"

// Helpers
export async function apply(options) {
  await applyCluster(options)
  await applyPg(options)
}

async function applyCluster(options) {
  const { event, events, force, onlyCluster } = options
  const props = [...options.props, "applyCluster"]

  const { clusters } = await events.gcloudReadConfig(
    options.props,
    event.options
  )

  const clusterList = await events.gcloudClusterList(props)
  const clusterIds = clusterList.map(({ name }) => name)

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
        msg: [
          "Add the --force flag to delete cluster",
          clusterId,
        ],
        op: "gcloud",
      })
      process.exit(1)
    }

    await events.gcloudClusterDelete(props, {
      clusterId,
      project,
    })
  }

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
  const { event, events, force, onlyPg } = options
  const props = [...options.props, "applyPg"]

  const { pg } = await events.gcloudReadConfig(
    options.props,
    event.options
  )

  const pgList = await events.gcloudPgList(props)
  const pgIds = pgList.map(({ name }) => name)

  for (const pgInstance of pgList) {
    const { name: pgId, project } = pgInstance

    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    if (!pg || !pg.instances || !pg.instances[pgId]) {
      if (!force) {
        await events.status(props, {
          fail: true,
          highlight: true,
          msg: [
            "Add the --force flag to delete database",
            pgId,
          ],
          op: "gcloud",
        })
        process.exit(1)
      }

      await events.gcloudPgDelete(props, { pgId, project })
    }
  }

  if (!pg || !pg.instances) {
    return
  }

  for (const pgId in pg.instances) {
    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    const {
      cpu,
      memory,
      project,
      user,
      zone,
    } = pg.instances[pgId]

    if (pgIds.indexOf(pgId) === -1) {
      await events.gcloudPgCreate(props, {
        cpu,
        memory,
        pgId,
        project,
        zone,
      })
    }

    const dbList = await events.gcloudDbList(props, {
      pgId,
    })

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

    const password = generatePassword(12, false)

    await events.gcloudPgCreateUser(props, {
      password,
      pgId,
      project,
      user,
    })

    await events.gcloudWriteSecret(options.props, {
      ...event.options,
      password,
      pgId,
    })
  }
}
