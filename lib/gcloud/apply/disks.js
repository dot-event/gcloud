export async function applyDisks(options) {
  const { events, props } = options

  await events.gcloudDisksList(props)
  await events.gcloudSnapshotsList(props)

  await diskDelete(options)
  await diskCreate(options)
}

async function diskCreate(options) {
  const { event, events, onlyDisks, props } = options

  const { diskNames, gcloudConfig } = diskConfig(options)

  const { disks } = gcloudConfig

  if (!disks) {
    return
  }

  for (const diskName in disks) {
    if (onlyDisks && onlyDisks !== diskName) {
      continue
    }

    if (diskNames.indexOf(diskName) > -1) {
      continue
    }

    const snapshot = fromSnapshot({
      ...event.options,
      ...disks[diskName],
      diskName,
    })

    await events.gcloudDisksCreate(props, {
      ...disks[diskName],
      diskName,
      snapshot,
    })
  }
}

async function diskDelete(options) {
  const { events, forceDisks, onlyDisks, props } = options

  const { disksList, gcloudConfig } = diskConfig(options)

  const { disks } = gcloudConfig

  for (const disk of disksList) {
    const { name: diskName, selfLink, zone: zoneUrl } = disk
    const project = selfLink.match(/\/projects\/([^/]+)/)[1]
    const zone = zoneUrl.match(/[^/]+$/)[0]

    if (onlyDisks && onlyDisks !== diskName) {
      continue
    }

    if (disks && disks[diskName]) {
      continue
    }

    if (diskName.match(/^gke-/)) {
      continue
    }

    if (!forceDisks) {
      await events.status(props, {
        fail: true,
        highlight: true,
        msg: [
          "add --force-disks to delete disks like",
          diskName,
          "BE CAREFUL!!!",
        ],
        op: "gcloud",
      })
      process.exit(1)
    }

    if (
      diskName.indexOf("prod") === -1 ||
      forceDisks === "prod"
    ) {
      await events.gcloudDisksDelete(props, {
        diskName,
        lax: true,
        project,
        zone,
      })
    }
  }
}

function diskConfig(options) {
  const { events, props } = options

  const { gcloudConfig } = events.get(props)

  const disksList = events.get([
    ...props,
    "disksList",
    "all",
  ])

  const diskNames = disksList.map(({ name }) => name)

  return { diskNames, disksList, gcloudConfig }
}

function fromSnapshot(options) {
  const { diskName, events, from, props } = options

  if (!from) {
    return
  }

  const { gcloudConfig } = events.get(props)
  const { clusters } = gcloudConfig
  const { project } = clusters[from]

  const { out: snapshotsList } = events.get([
    ...props,
    "pgSnapshotsList",
    project,
  ])

  const serviceId = diskName.match(/[^-]+-(.+)$/)[1]

  const snapshot = snapshotsList.find(
    ({ sourceDisk }) =>
      sourceDisk.match(/\/([^/]+)$/)[1] ===
      `${from}-${serviceId}`
  )

  // prettier-ignore
  return snapshot
    ? `https://www.googleapis.com/compute/v1/projects/${project}/global/snapshots/${
      snapshot.name
    }`
    : undefined
}
