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
