export async function storageAcl(options) {
  const {
    dest,
    events,
    flag,
    props,
    serviceAccount,
  } = options

  await events.spawn([...props, "storageAcl"], {
    args: [
      "acl",
      "ch",
      "-u",
      `${serviceAccount}:${flag}`,
      `gs://${dest}`,
    ],
    command: "gsutil",
  })
}
