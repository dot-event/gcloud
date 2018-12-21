export async function applyDisks(options) {
  const { events, props } = options

  await events.gcloudDisksList(props)

  await diskDelete(options)
  await diskCreate(options)
}

async function diskCreate(options) {
  const { events, onlyDisks, props } = options

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

    await events.gcloudDisksCreate(props, {
      ...disks[diskName],
      diskName,
    })
  }
}

async function diskDelete(options) {
  const { events, forceDisks, onlyDisks, props } = options

  const { disksList, gcloudConfig } = diskConfig(options)

  const { disks } = gcloudConfig

  for (const disk of disksList) {
    const { name: diskName, zone: zoneUrl } = disk
    const zone = zoneUrl.match(/[^/]+$/)[0]

    if (onlyDisks && onlyDisks !== diskName) {
      continue
    }

    if (disks && disks[diskName]) {
      continue
    }

    if (forceDisks) {
      await events.gcloudDisksDelete(props, {
        ...disks[diskName],
        diskName,
        lax: true,
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
