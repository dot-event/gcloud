// Packages
import dotArgv, { argvRelay } from "@dot-event/argv"
import dotLog from "@dot-event/log"
import dotSpawn from "@dot-event/spawn"
import dotStore from "@dot-event/store"

// Helpers
import { apply } from "./gcloud/apply"
import { argv } from "./gcloud/argv"

import {
  clusterCreate,
  clusterDelete,
  clusterList,
} from "./gcloud/cluster"

import { configPgId } from "./gcloud/config/configPgId"
import { configRead } from "./gcloud/config/configRead"
import { configSync } from "./gcloud/config/configSync"
import { configWrite } from "./gcloud/config/configWrite"
import { dbCreate } from "./gcloud/db/dbCreate"
import { dbDelete } from "./gcloud/db/dbDelete"
import { dbList } from "./gcloud/db/dbList"
import { pgCreate } from "./gcloud/pg/pgCreate"
import { pgCreateUser } from "./gcloud/pg/pgCreateUser"
import { pgDelete } from "./gcloud/pg/pgDelete"
import { pgDescribe } from "./gcloud/pg/pgDescribe"
import { pgImport } from "./gcloud/pg/pgImport"
import { pgList } from "./gcloud/pg/pgList"
import { pgUserList } from "./gcloud/pg/pgUserList"
import { storageAcl } from "./gcloud/storage/storageAcl"
import { storageCopy } from "./gcloud/storage/storageCopy"
import { storageMakeBucket } from "./gcloud/storage/storageMakeBucket"

// Composer
export default function(options) {
  const { events } = options

  if (events.ops.has("gcloud")) {
    return options
  }

  dotArgv({ events })
  dotLog({ events })
  dotSpawn({ events })
  dotStore({ events })

  events.onAny({
    gcloud: argvRelay,
    gcloudApply: apply,
    gcloudClusterCreate: clusterCreate,
    gcloudClusterDelete: clusterDelete,
    gcloudClusterList: clusterList,
    gcloudConfigPgId: configPgId,
    gcloudConfigRead: configRead,
    gcloudConfigSync: configSync,
    gcloudConfigWrite: configWrite,
    gcloudDbCreate: dbCreate,
    gcloudDbDelete: dbDelete,
    gcloudDbList: dbList,
    gcloudPgCreate: pgCreate,
    gcloudPgCreateUser: pgCreateUser,
    gcloudPgDelete: pgDelete,
    gcloudPgDescribe: pgDescribe,
    gcloudPgImport: pgImport,
    gcloudPgList: pgList,
    gcloudPgUserList: pgUserList,
    gcloudSetupOnce: argv,
    gcloudStorageAcl: storageAcl,
    gcloudStorageCopy: storageCopy,
    gcloudStorageMakeBucket: storageMakeBucket,
  })

  return options
}
