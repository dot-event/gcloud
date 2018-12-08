// Packages
import generatePassword from "password-generator"

// Helpers
export async function applyPg(options) {
  const { events, props } = options

  await events.gcloudPgList(props)

  await pgDelete(options)
  await pgCreate(options)
}

async function pgDelete(options) {
  const { events, force, onlyPg, props } = options

  const { config, pgList } = pgConfig(options)
  const { pg } = config

  for (const pgInstance of pgList) {
    const { name: pgId, project } = pgInstance

    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    if (!pg || !pg[pgId]) {
      if (!force) {
        await events.status(props, {
          fail: true,
          highlight: true,
          msg: ["add --force to delete database:", pgId],
          op: "gcloud",
        })
        process.exit(1)
      }

      await events.gcloudPgDelete(props, { pgId, project })
    }
  }
}

async function pgCreate(options) {
  const { events, onlyPg, props } = options

  const { config, pgIds } = pgConfig(options)
  const { pg } = config

  if (!pg) {
    return
  }

  for (const pgId in pg) {
    if (onlyPg && onlyPg !== pgId) {
      continue
    }

    if (pgIds.indexOf(pgId) === -1) {
      await events.gcloudPgCreate(props, {
        ...pg[pgId],
        pgId,
      })
    }

    await createDbs({ ...options, pgId })
    await createUser({ ...options, pgId })
  }
}

async function createDbs(options) {
  const { events, pgId, props } = options

  const { config } = pgConfig(options)
  const { pg } = config
  const { dbs, project } = pg[pgId]

  const dbList = await events.gcloudDbList(props, {
    pgId,
  })

  const dbIds = dbList.map(({ name }) => name)

  for (const dbId of dbs) {
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

async function createUser(options) {
  const { event, events, pgId, props } = options

  const pgUserList = await events.gcloudPgUserList(
    props,
    options
  )
  const pgUserIds = pgUserList.map(({ name }) => name)

  const { config } = pgConfig(options)
  const { pg } = config
  const { project, user } = pg[pgId]

  if (pgUserIds.indexOf(user) > -1) {
    return
  }

  const password = generatePassword(12, false)

  await events.gcloudPgCreateUser(props, {
    password,
    pgId,
    project,
    user,
  })

  await events.gcloudConfigWrite(props, {
    ...event.options,
    password,
    pgId,
  })
}

function pgConfig(options) {
  const { events, props } = options

  const config = events.get([...props, "config"])
  const pgList = events.get([...props, "pgList", "out"])
  const pgIds = pgList.map(({ name }) => name)

  return { config, pgIds, pgList }
}
