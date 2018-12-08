export async function pgCreate(options) {
  const {
    cpu,
    events,
    memory,
    pgId,
    project,
    props,
    zone,
  } = options

  await events.spawn([...props, "pgCreate", pgId], {
    args: [
      "beta",
      "sql",
      "instances",
      "create",
      pgId,
      `--project=${project}`,
      `--gce-zone=${zone}`,
      "--database-version=POSTGRES_9_6",
      `--cpu=${cpu}`,
      `--memory=${memory}`,
      "--network=default",
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}

export async function pgCreateUser(options) {
  const {
    events,
    password,
    pgId,
    project,
    props,
    user,
  } = options

  await events.spawn([...props, "pgCreateUser", pgId], {
    args: [
      "sql",
      "users",
      "create",
      user,
      `--instance=${pgId}`,
      `--password=${password}`,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}

export async function pgDelete(options) {
  const { events, pgId, project, props } = options

  await events.spawn([...props, "pgDelete", pgId], {
    args: [
      "sql",
      "instances",
      "delete",
      pgId,
      `--project=${project}`,
      "--quiet",
    ],
    command: "gcloud",
    silent: false,
  })
}

export async function pgList(options) {
  const { event, events, props } = options

  const { out } = await events.spawn([...props, "pgList"], {
    args: ["sql", "instances", "list", "--format=json"],
    command: "gcloud",
    json: true,
  })

  event.signal.returnValue = out
}

export async function pgUserList(options) {
  const { event, events, pgId, props } = options

  const { out } = await events.spawn(
    [...props, "pgUserList"],
    {
      args: [
        "sql",
        "users",
        "list",
        `--instance=${pgId}`,
        "--format=json",
      ],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
